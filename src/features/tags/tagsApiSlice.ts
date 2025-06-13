import { createApi } from '@reduxjs/toolkit/query/react';
import { createAwsSignedBaseQuery } from '../../app/awsSignedBaseQuery';
import type { Tag } from '../../types';
import { IDENTITY_POOL_ID, RECIPES_SERVICE_URL } from '../../constants';

interface TagsApiResponse {
    data: Tag[] | null;
    errorMessage: string | null;
}

export const tagsApiSlice = createApi({
    baseQuery: createAwsSignedBaseQuery({
        baseUrl: RECIPES_SERVICE_URL,
        identityPoolId: IDENTITY_POOL_ID,
    }),

    reducerPath: 'tagsApi',
    endpoints: (build) => ({
        getTags: build.query<TagsApiResponse, void>({
            query: () => 'recipes/tags',
        }),
    }),
});

export const { useGetTagsQuery } = tagsApiSlice;
