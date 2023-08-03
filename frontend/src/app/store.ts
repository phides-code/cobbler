import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import recipeReducer from '../features/recipe/recipeSlice';
import {
    authoredRecipesSlice,
    likedRecipesSlice,
    allRecipesSlice,
} from '../features/recipes/recipesSlice';
import userReducer from '../features/user/userSlice';
import nicknameReducer from '../features/nickname/nicknameSlice';

export const store = configureStore({
    reducer: {
        recipe: recipeReducer,
        authoredRecipes: authoredRecipesSlice.reducer,
        likedRecipes: likedRecipesSlice.reducer,
        allRecipes: allRecipesSlice.reducer,
        user: userReducer,
        nickname: nicknameReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
