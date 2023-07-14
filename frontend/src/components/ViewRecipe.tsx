import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import {
    fetchRecipesByIds,
    selectRecipes,
} from '../features/recipes/recipesSlice';
import { useSelector } from 'react-redux';
import { fetchUser, selectUser } from '../features/user/userSlice';

const ViewRecipe = () => {
    const dispatch = useAppDispatch();
    const { recipeId } = useParams<{ recipeId: string }>();

    const recipesState = useSelector(selectRecipes);
    const recipe = recipesState.recipes?.find((element) => true);

    const userState = useSelector(selectUser);
    const author = userState.user;

    const isLoading: Boolean =
        recipesState.status === 'loading' || userState.status === 'loading';

    useEffect(() => {
        if (recipeId) {
            dispatch(fetchRecipesByIds([recipeId]));
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
                by <Link to='/'>{author?.nickname}</Link>
            </div>
        </div>
    );
};

export default ViewRecipe;
