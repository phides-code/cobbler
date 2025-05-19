import { useParams } from 'react-router';
import { useGetRecipeByIdQuery } from '../features/recipes/recipesApiSlice';

const ViewRecipe = () => {
    const URL_PREFIX = import.meta.env.VITE_URL_PREFIX as string;

    const { id } = useParams<{ id: string }>();
    const { data, isLoading, isError } = useGetRecipeByIdQuery(id ?? '');

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data || !data.data) {
        return <div>Recipe not found.</div>;
    }

    const recipe = data.data;

    return (
        <div>
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>
            {recipe.imageSource.uuidName !== '' && (
                <img
                    src={`${URL_PREFIX}/assets/${recipe.imageSource.uuidName}`}
                    alt={recipe.title}
                    style={{ width: '300px', height: 'auto' }}
                />
            )}
            <h2>Ingredients banana</h2>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <h2>Steps</h2>
            <ol>
                {recipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default ViewRecipe;
