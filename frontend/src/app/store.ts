import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import recipeReducer from '../features/recipe/recipeSlice';
import {
    authoredRecipesSlice,
    likedRecipesSlice,
} from '../features/recipes/recipesSlice';
import userReducer from '../features/user/userSlice';
import nicknameReducer from '../features/nickname/nicknameSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        recipe: recipeReducer,
        authoredRecipes: authoredRecipesSlice.reducer,
        likedRecipes: likedRecipesSlice.reducer,
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
