import { createApi } from '@reduxjs/toolkit/query/react';
import type { ImageDataPayload } from '../../types';
import { createAwsSignedBaseQuery } from '../../app/createAwsSignedBaseQuery';

interface ImageApiResponse {
    data: string | null;
    errorMessage: string | null;
}

export const imageApiSlice = createApi({
    baseQuery: createAwsSignedBaseQuery({
        baseUrl: import.meta.env.VITE_IMAGE_SERVICE_URL,
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
