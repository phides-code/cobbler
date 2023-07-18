import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';
import { Recipe } from '../../app/types';
import { RootState } from '../../app/store';

interface FetchResponseType {
    recipes?: Recipe[] | null;
    error?: string | null;
}

interface RecipesState extends FetchResponseType {
    status: 'idle' | 'loading' | 'failed';
}

const initialState: RecipesState = {
    recipes: null,
    status: 'idle',
    error: null,
};

const fetchRecipes = async (recipeIds: string[]) => {
    const rawFetchResponse = await fetch('/api/getRecipesByIds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            recipeIds,
        }),
    });

    const fetchResponse: FetchResponseType = await rawFetchResponse.json();

    return fetchResponse;
};

export const fetchLikedRecipesByIds = createAsyncThunk(
    'likedRecipes/fetchLikedRecipesByIds',
    fetchRecipes
);

export const fetchAuthoredRecipesByIds = createAsyncThunk(
    'authoredRecipes/fetchAuthoredRecipesByIds',
    fetchRecipes
);

export const authoredRecipesSlice = createSlice({
    name: 'authoredRecipes',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchAuthoredRecipesByIds.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAuthoredRecipesByIds.fulfilled, (state, action) => {
                state.status = 'idle';
                state.recipes = action.payload.recipes;
            })
            .addCase(fetchAuthoredRecipesByIds.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const likedRecipesSlice = createSlice({
    name: 'likedRecipes',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchLikedRecipesByIds.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLikedRecipesByIds.fulfilled, (state, action) => {
                state.status = 'idle';
                state.recipes = action.payload.recipes;
            })
            .addCase(fetchLikedRecipesByIds.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const selectAuthoredRecipes = createSelector(
    (state: RootState) => state.authoredRecipes,
    (authoredRecipes) => authoredRecipes
);

export const selectLikedRecipes = createSelector(
    (state: RootState) => state.likedRecipes,
    (likedRecipes) => likedRecipes
);
