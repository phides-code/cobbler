// awsSignedBaseQuery.ts
// Custom baseQuery for RTK Query that signs requests with AWS Signature V4 using Cognito Identity credentials

import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-browser';
import { FetchHttpHandler } from '@aws-sdk/fetch-http-handler';
import {
    CognitoIdentityClient,
    GetIdCommand,
    GetCredentialsForIdentityCommand,
} from '@aws-sdk/client-cognito-identity';

// Interface for caching AWS credentials
interface CachedCredentials {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration: number;
}

// Factory function to create a baseQuery that signs requests with AWS credentials
export const createAwsSignedBaseQuery = ({
    baseUrl,
    region,
    identityPoolId,
}: {
    baseUrl: string;
    region: string;
    identityPoolId: string;
}): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
    // Parse the base URL for later use
    const base = new URL(baseUrl);
    // Cache credentials to avoid unnecessary Cognito calls
    let cachedCredentials: CachedCredentials | null = null;

    // Helper to get (and cache) AWS credentials from Cognito Identity Pool
    async function getCredentials(): Promise<CachedCredentials> {
        // If no credentials or credentials are expiring soon, fetch new ones
        if (
            !cachedCredentials ||
            Date.now() > cachedCredentials.expiration - 60 * 1000 // refresh 1 min before expiration
        ) {
            const identityClient = new CognitoIdentityClient({ region });
            // Get the Cognito Identity ID
            const { IdentityId } = await identityClient.send(
                new GetIdCommand({ IdentityPoolId: identityPoolId })
            );

            // Get temporary AWS credentials for the identity
            const { Credentials } = await identityClient.send(
                new GetCredentialsForIdentityCommand({ IdentityId })
            );

            if (!Credentials) {
                throw new Error('Failed to retrieve AWS credentials');
            }

            // Cache the credentials and their expiration
            cachedCredentials = {
                accessKeyId: Credentials.AccessKeyId!,
                secretAccessKey: Credentials.SecretKey!,
                sessionToken: Credentials.SessionToken!,
                expiration: new Date(Credentials.Expiration!).getTime(),
            };
        }

        return cachedCredentials;
    }

    // The actual baseQuery function used by RTK Query
    return async (args, _api, _extraOptions) => {
        try {
            // Get valid AWS credentials
            const creds = await getCredentials();
            // Create a SignatureV4 signer for the execute-api service
            const signer = new SignatureV4({
                service: 'execute-api',
                region,
                credentials: {
                    accessKeyId: creds.accessKeyId,
                    secretAccessKey: creds.secretAccessKey,
                    sessionToken: creds.sessionToken,
                },
                sha256: Sha256,
            });

            // Parse args into url, method, and body
            const {
                url,
                method = 'GET',
                body,
            } = typeof args === 'string' ? { url: args } : args;

            // Build the full request URL
            const target = new URL(url, base.href);
            // Sign the request using AWS Signature V4
            const signedRequest = await signer.sign({
                method,
                protocol: target.protocol,
                hostname: target.hostname,
                path: target.pathname + target.search,
                body: body ? JSON.stringify(body) : undefined,
                headers: {
                    host: target.hostname,
                    'content-type': 'application/json',
                },
            });

            // Dynamically import ProtocolHttpRequest for compatibility
            const { HttpRequest: ProtocolHttpRequest } = await import(
                '@aws-sdk/protocol-http'
            );

            // Create a ProtocolHttpRequest from the signed request
            const protocolHttpRequest = new ProtocolHttpRequest({
                ...signedRequest,
                headers: signedRequest.headers,
                body: signedRequest.body,
            });

            // Send the request using FetchHttpHandler
            const { response } = await new FetchHttpHandler().handle(
                protocolHttpRequest
            );
            // Read the response body as text and parse as JSON
            const text = response.body
                ? await new Response(response.body).text()
                : '';
            const data = text ? JSON.parse(text) : null;

            // If the response is not 2xx, return an error
            if (response.statusCode < 200 || response.statusCode >= 300) {
                return {
                    error: {
                        status: response.statusCode,
                        data,
                    } as FetchBaseQueryError,
                };
            }

            // Return the data and meta info for successful responses
            return {
                data,
                meta: response,
            };
        } catch (error: any) {
            // Handle network or signing errors
            return {
                error: {
                    status: 'FETCH_ERROR' as const,
                    data: error?.message || error?.toString(),
                } as FetchBaseQueryError,
            };
        }
    };
};
