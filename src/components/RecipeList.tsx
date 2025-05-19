import { useNavigate } from 'react-router';
import { useGetRecipesQuery } from '../features/recipes/recipesApiSlice';
import type { Recipe } from '../types';

const RecipeList = () => {
    const navigate = useNavigate();

    const { data, isLoading, isFetching, isError } = useGetRecipesQuery();

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
        <div>
            <div>
                <button type='button' onClick={() => navigate('/add-recipe')}>
                    Add a recipe
                </button>
            </div>

            <div>
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                    >
                        <h3>{recipe.title}</h3>
                        <p>{recipe.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipeList;
