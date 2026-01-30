import { createApi } from '@reduxjs/toolkit/query/react';
import type { Recipe } from '../../types';
import { createAwsSignedBaseQuery } from '../../app/createAwsSignedBaseQuery';

interface RecipesApiResponse {
    data: Recipe[] | null;
    errorMessage: string | null;
}

interface RecipeApiResponse {
    data: Recipe | null;
    errorMessage: string | null;
}

export const recipesApiSlice = createApi({
    baseQuery: createAwsSignedBaseQuery({
        baseUrl: import.meta.env.VITE_RECIPES_SERVICE_URL,
    }),

    reducerPath: 'recipesApi',
    endpoints: (build) => ({
        getRecipes: build.query<RecipesApiResponse, void>({
            query: () => ({
                url: 'recipes',
                method: 'GET',
            }),
        }),
        getRecipeById: build.query<RecipeApiResponse, string>({
            query: (id) => ({
                url: `recipes/${id}`,
                method: 'GET',
            }),
        }),
        postRecipe: build.mutation<RecipeApiResponse, Partial<Recipe>>({
            query: (newRecipe) => ({
                url: 'recipes',
                method: 'POST',
                body: newRecipe,
            }),
        }),
        deleteRecipe: build.mutation<RecipeApiResponse, string>({
            query: (id) => ({
                url: `recipes/${id}`,
                method: 'DELETE',
            }),
        }),
        putRecipe: build.mutation<RecipeApiResponse, Partial<Recipe>>({
            query: (updatedRecipe) => ({
                url: `recipes/${updatedRecipe.id}`,
                method: 'PUT',
                body: updatedRecipe,
            }),
        }),
        searchRecipes: build.query<RecipesApiResponse, string>({
            query: (searchText) => ({
                url: `recipes?q=${searchText}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetRecipesQuery,
    useGetRecipeByIdQuery,
    usePostRecipeMutation,
    useDeleteRecipeMutation,
    usePutRecipeMutation,
    useSearchRecipesQuery,
} = recipesApiSlice;
