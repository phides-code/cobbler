import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';
import { Recipe } from '../../app/types';
import { RootState } from '../../app/store';

interface FetchResponseType {
    recipe?: Recipe;
    error?: string;
}

interface Recipetate extends FetchResponseType {
    status: 'idle' | 'loading' | 'failed';
}

const initialState: Recipetate = {
    recipe: undefined,
    status: 'idle',
    error: undefined,
};

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
            });
    },
});

export const selectRecipe = createSelector(
    (state: RootState) => state.recipe,
    (recipe) => recipe
);

export default recipeSlice.reducer;
