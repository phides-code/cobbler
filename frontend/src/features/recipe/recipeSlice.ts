import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';
import { Recipe, LikeUnlikeRecipeProps } from '../../app/types';
import { RootState } from '../../app/store';
import { DeleteResult } from 'mongodb';

interface FetchResponseType {
    recipe?: Recipe | null;
    error?: string | null;
}

interface RecipeState extends FetchResponseType {
    status: 'idle' | 'loading' | 'failed';
}

const initialState: RecipeState = {
    recipe: null,
    status: 'idle',
    error: null,
};

export const deleteRecipe = createAsyncThunk(
    'recipe/deleteRecipe',
    async (recipeToDelete: Partial<Recipe>) => {
        const rawfetchResponse = await fetch('/api/deleteRecipe', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipeToDelete,
            }),
        });

        const fetchResponse: DeleteResult = await rawfetchResponse.json();

        return fetchResponse;
    }
);

export const createRecipe = createAsyncThunk(
    'recipe/createRecipe',
    async (newRecipe: Partial<Recipe>) => {
        const rawFetchResponse = await fetch('/api/createRecipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newRecipe,
            }),
        });

        const fetchResponse: FetchResponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

export const fetchRecipeById = createAsyncThunk(
    'recipe/fetchRecipeById',
    async (recipeId: string) => {
        const rawFetchResponse = await fetch('/api/getRecipeById', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipeId,
            }),
        });

        const fetchResponse: FetchResponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

export const likeUnlikeRecipe = createAsyncThunk(
    'recipe/likeUnlikeRecipe',
    async ({ recipeId, type, userId }: LikeUnlikeRecipeProps) => {
        await fetch('/api/likeUnlikeRecipe', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipeId,
                type,
                userId,
            }),
        });

        return { type, userId };
    }
);

export const updateRecipe = createAsyncThunk(
    'recipe/updateRecipe',
    async (updatedRecipe: Recipe) => {
        const rawFetchResponse = await fetch('/api/updateRecipe', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                updatedRecipe,
            }),
        });

        const fetchResponse: FetchResponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

const recipeSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchRecipeById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRecipeById.fulfilled, (state, action) => {
                state.status = 'idle';
                state.recipe = action.payload.recipe;
            })
            .addCase(fetchRecipeById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(likeUnlikeRecipe.fulfilled, (state, action) => {
                const { type, userId } = action.payload;

                if (state.recipe) {
                    if (type === 'like') {
                        if (!state.recipe?.likedBy?.includes(userId)) {
                            state.recipe?.likedBy?.push(userId);
                        }
                    } else {
                        if (state.recipe?.likedBy?.includes(userId)) {
                            state.recipe.likedBy =
                                state.recipe?.likedBy?.filter(
                                    (likedByUserId) => likedByUserId !== userId
                                );
                        }
                    }
                }
            })
            .addCase(createRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createRecipe.fulfilled, (state, action) => {
                state.status = 'idle';
                state.recipe = action.payload.recipe;
            })
            .addCase(createRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteRecipe.fulfilled, (state) => {
                state.status = 'idle';
            })
            .addCase(deleteRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRecipe.fulfilled, (state, action) => {
                state.status = 'idle';
                state.recipe = action.payload.recipe;
            })
            .addCase(updateRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const selectRecipe = createSelector(
    (state: RootState) => state.recipe,
    (recipe) => recipe
);

export default recipeSlice.reducer;
