import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import {
    fetchLikedRecipesByIds,
    fetchAuthoredRecipesByIds,
    selectAuthoredRecipes,
    selectLikedRecipes,
} from '../features/recipes/recipesSlice';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ListRecipesProps {
    type: 'liked' | 'authored';
    recipeIds: string[];
}

const ListRecipes = ({ type, recipeIds }: ListRecipesProps) => {
    const dispatch = useAppDispatch();

    const recipesState = useSelector(
        type === 'liked' ? selectLikedRecipes : selectAuthoredRecipes
    );

    const recipes = recipesState.recipes;
    const isLoading = recipesState.status === 'loading';

    useEffect(() => {
        if (recipeIds) {
            dispatch(
                type === 'liked'
                    ? fetchLikedRecipesByIds(recipeIds)
                    : fetchAuthoredRecipesByIds(recipeIds)
            );
        }
    }, [dispatch, recipeIds, type]);

    if (isLoading) return <div>...</div>;

    return (
        <div>
            {recipes?.map((recipe) => (
                <div key={recipe._id.toString()}>
                    <Link to={`/recipe/${recipe._id}`}>{recipe.title}</Link>
                </div>
            ))}
        </div>
    );
};

export default ListRecipes;
