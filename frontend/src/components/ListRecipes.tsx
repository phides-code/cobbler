import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import {
    fetchLikedRecipesByIds,
    fetchAuthoredRecipesByIds,
    selectAuthoredRecipes,
    selectLikedRecipes,
    selectAllRecipes,
    fetchAllRecipes,
} from '../features/recipes/recipesSlice';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PreviewCard from './PreviewCard';
import { RecipeListType } from '../app/types';

interface ListRecipesProps {
    type: RecipeListType;
    recipeIds?: string[];
}

const ListRecipes = ({ type, recipeIds }: ListRecipesProps) => {
    const dispatch = useAppDispatch();

    const recipesState = useSelector(
        type && type === 'LIKED'
            ? selectLikedRecipes
            : type === 'AUTHORED'
            ? selectAuthoredRecipes
            : selectAllRecipes
    );

    const recipes = recipesState.recipes;
    const isLoading = recipesState.status === 'loading';

    useEffect(() => {
        if (recipeIds && type) {
            switch (type) {
                case 'LIKED':
                    dispatch(fetchLikedRecipesByIds(recipeIds));
                    break;
                case 'AUTHORED':
                    dispatch(fetchAuthoredRecipesByIds(recipeIds));
                    break;

                default:
            }
        } else if (type === 'ALL') {
            dispatch(fetchAllRecipes());
        }
    }, [dispatch, recipeIds, type]);

    if (isLoading) return <div>...</div>;

    if (recipes?.length === 0) return <div>No recipes to show</div>;

    return (
        <div>
            {recipes &&
                recipes?.map((recipe) => (
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
