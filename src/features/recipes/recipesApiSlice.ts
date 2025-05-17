import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Recipe } from '../../types';

const RECIPES_SERVICE_URL = import.meta.env.VITE_RECIPES_SERVICE_URL as string;
const RECIPES_SERVICE_API_KEY = import.meta.env
    .VITE_RECIPES_SERVICE_API_KEY as string;

const prepareHeaders = (headers: Headers) => {
    headers.set('x-api-key', RECIPES_SERVICE_API_KEY);
    return headers;
};

interface RecipesApiResponse {
    data: Recipe[] | null;
    errorMessage: string | null;
}

interface RecipeApiResponse {
    data: Recipe | null;
    errorMessage: string | null;
}

export const recipesApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: RECIPES_SERVICE_URL,
        prepareHeaders,
    }),

    reducerPath: 'recipesApi',
    endpoints: (build) => ({
        getRecipes: build.query<RecipesApiResponse, void>({
            query: () => '',
        }),
        postRecipe: build.mutation<RecipeApiResponse, Partial<Recipe>>({
            query: (newRecipe) => ({
                url: '',
                method: 'POST',
                body: newRecipe,
            }),
        }),
        deleteRecipe: build.mutation<RecipeApiResponse, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
        putRecipe: build.mutation<RecipeApiResponse, Partial<Recipe>>({
            query: (updatedRecipe) => ({
                url: `/${updatedRecipe.id}`,
                method: 'PUT',
                body: updatedRecipe,
            }),
        }),
    }),
});

export const {
    useGetRecipesQuery,
    usePostRecipeMutation,
    useDeleteRecipeMutation,
    usePutRecipeMutation,
} = recipesApiSlice;
