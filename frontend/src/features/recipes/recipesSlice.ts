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

export const fetchAllRecipes = createAsyncThunk(
    'allRecipes/fetchAllRecipes',
    async () => {
        const rawFetchResponse = await fetch('/api/getAllRecipes');

        const fetchResponse: FetchResponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

const fetchRecipesByIds = async (recipeIds: string[]) => {
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
    fetchRecipesByIds
);

export const fetchAuthoredRecipesByIds = createAsyncThunk(
    'authoredRecipes/fetchAuthoredRecipesByIds',
    fetchRecipesByIds
);

export const allRecipesSlice = createSlice({
    name: 'allRecipes',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchAllRecipes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllRecipes.fulfilled, (state, action) => {
                state.status = 'idle';
                state.recipes = action.payload.recipes;
            })
            .addCase(fetchAllRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

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

export const selectAllRecipes = createSelector(
    (state: RootState) => state.allRecipes,
    (allRecipes) => allRecipes
);

export const selectAuthoredRecipes = createSelector(
    (state: RootState) => state.authoredRecipes,
    (authoredRecipes) => authoredRecipes
);

export const selectLikedRecipes = createSelector(
    (state: RootState) => state.likedRecipes,
    (likedRecipes) => likedRecipes
);
