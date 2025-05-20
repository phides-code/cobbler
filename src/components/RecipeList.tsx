import { useNavigate } from 'react-router';
import { useGetRecipesQuery } from '../features/recipes/recipesApiSlice';
import type { Recipe } from '../types';
import RecipeLinkCard from './RecipeLinkCard';
import { LOCAL_STORAGE_KEY } from '../constants';

const RecipeList = () => {
    const navigate = useNavigate();

    const { data, isLoading, isFetching, isError } = useGetRecipesQuery();

    // Get liked recipes from localStorage
    const getLikedRecipeIds = (): string[] => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    };

    const likedRecipeIds = getLikedRecipeIds();

    if (isLoading || isFetching) return <p>Loading recipes...</p>;
    if (isError)
        return (
            <p>
                Something went wrong while loading the recipes. Please try
                again.
            </p>
        );

    const recipes = data?.data as Recipe[];

    if (recipes.length === 0) return <p>No recipes found</p>;

    return (
        <div className='recipe-list-container'>
            <div className='add-recipe-bar'>
                <button type='button' onClick={() => navigate('/add-recipe')}>
                    Add a recipe
                </button>
            </div>

            <div className='recipe-grid'>
                {recipes.map((recipe) => (
                    <RecipeLinkCard
                        key={recipe.id}
                        id={recipe.id as string}
                        src={recipe.imageSource.uuidName}
                        title={recipe.title}
                        description={recipe.description}
                        likes={recipe.likes}
                        isLikedByMe={likedRecipeIds.includes(
                            recipe.id as string
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecipeList;
