import { createApi } from '@reduxjs/toolkit/query/react';
import { createAwsSignedBaseQuery } from '../../app/awsSignedBaseQuery';
import type { ImageDataPayload } from '../../types';

interface ImageApiResponse {
    data: string | null;
    errorMessage: string | null;
}

export const imageApiSlice = createApi({
    baseQuery: createAwsSignedBaseQuery({
        baseUrl: import.meta.env.VITE_IMAGE_SERVICE_URL,
        region: import.meta.env.VITE_AWS_REGION,
        identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
    }),

    reducerPath: 'imageApi',
    endpoints: (build) => ({
        uploadImage: build.mutation<ImageApiResponse, ImageDataPayload>({
            query: (body) => ({
                url: 'image',
                method: 'POST',
                body,
            }),
        }),
        deleteImage: build.mutation<ImageApiResponse, string>({
            query: (imageId) => ({
                url: `image/${imageId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = imageApiSlice;
