import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ImageDataPayload } from '../../types';

interface ImageApiResponse {
    data: string | null;
    errorMessage: string | null;
}

const PATH = 'image';

export const imageApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_IMAGE_SERVICE_URL,
    }),

    reducerPath: `${PATH}Api`,
    endpoints: (build) => ({
        uploadImage: build.mutation<ImageApiResponse, ImageDataPayload>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
        }),
        deleteImage: build.mutation<ImageApiResponse, string>({
            query: (imageId) => ({
                url: `/${imageId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = imageApiSlice;
