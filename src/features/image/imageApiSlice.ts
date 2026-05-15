import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ImageDataPayload } from '../../types';

interface ImageApiResponse {
    data: string | null;
    errorMessage: string | null;
}

export const imageApiSlice = createApi({
    baseQuery: fetchBaseQuery({
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
