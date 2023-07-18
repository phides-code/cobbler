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
import PreviewCard from './PreviewCard';

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
            if (type === 'liked') {
                dispatch(fetchLikedRecipesByIds(recipeIds));
            } else if (type === 'authored') {
                dispatch(fetchAuthoredRecipesByIds(recipeIds));
            }
        }
    }, [dispatch, recipeIds, type]);

    if (isLoading) return <div>...</div>;

    return (
        <div>
            {recipes?.map((recipe) => (
                <div key={recipe._id.toString()}>
                    <Link to={`/recipe/${recipe._id}`}>
                        <PreviewCard recipe={recipe} />
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default ListRecipes;
