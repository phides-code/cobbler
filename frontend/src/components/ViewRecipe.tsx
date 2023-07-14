import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';

import { useSelector } from 'react-redux';
import { fetchUser, selectUser } from '../features/user/userSlice';
import { fetchRecipeById, selectRecipe } from '../features/recipe/recipeSlice';

const ViewRecipe = () => {
    const dispatch = useAppDispatch();
    const { recipeId } = useParams<{ recipeId: string }>();

    const recipesState = useSelector(selectRecipe);
    const recipe = recipesState.recipe;

    const userState = useSelector(selectUser);
    const author = userState.user;

    const isLoading: Boolean =
        recipesState.status === 'loading' || userState.status === 'loading';

    useEffect(() => {
        if (recipeId) {
            dispatch(fetchRecipeById(recipeId));
        }
    }, [dispatch, recipeId]);

    useEffect(() => {
        if (recipe) {
            dispatch(fetchUser(recipe.authorId));
        }
    }, [dispatch, recipe]);

    if (isLoading) return <div>...</div>;

    return (
        <div>
            <div>{recipe?.title}</div>
            <div>{recipe?.description}</div>
            <div>
                by <Link to={`/user/${author?._id}`}>{author?.nickname}</Link>
            </div>
        </div>
    );
};

export default ViewRecipe;
