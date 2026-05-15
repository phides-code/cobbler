import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Recipe } from '../../types';

interface RecipesApiResponse {
    data: Recipe[] | null;
    errorMessage: string | null;
}

interface RecipeApiResponse {
    data: Recipe | null;
    errorMessage: string | null;
}

const PATH = 'recipes';

export const recipesApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_RECIPES_SERVICE_URL,
    }),

    reducerPath: `${PATH}Api`,
    endpoints: (build) => ({
        getRecipes: build.query<RecipesApiResponse, void>({
            query: () => ({
                url: '',
                method: 'GET',
            }),
        }),
        getRecipeById: build.query<RecipeApiResponse, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
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
        searchRecipes: build.query<RecipesApiResponse, string>({
            query: (searchText) => ({
                url: `?q=${searchText}`,
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
