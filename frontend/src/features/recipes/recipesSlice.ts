import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';
import { Recipe } from '../../app/types';
import { RootState } from '../../app/store';

interface FetchResponseType {
    recipes?: Recipe[];
    error?: string;
}

interface RecipesState extends FetchResponseType {
    status: 'idle' | 'loading' | 'failed';
}

const initialState: RecipesState = {
    recipes: undefined,
    status: 'idle',
    error: undefined,
};

export const fetchRecipesByIds = createAsyncThunk(
    'recipes/fetchRecipes',
    async (recipeIds: string[]) => {
        const rawFetchResponse = await fetch('/api/getRecipesByIds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipeIds,
            }),
        });

        const fetchResponse: FetchResponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

const recipesSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchRecipesByIds.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRecipesByIds.fulfilled, (state, action) => {
                state.status = 'idle';
                state.recipes = action.payload.recipes;
            })
            .addCase(fetchRecipesByIds.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const selectRecipes = createSelector(
    (state: RootState) => state.recipes,
    (recipes) => recipes
);

export default recipesSlice.reducer;
