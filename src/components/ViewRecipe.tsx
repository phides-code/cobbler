import { useParams } from 'react-router';
import { useGetRecipeByIdQuery } from '../features/recipes/recipesApiSlice';
import LikeButton from './LikeButton';
import { URL_PREFIX } from '../constants';

const ViewRecipe = () => {
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
            <LikeButton id={recipe.id as string} likes={recipe.likes} />
            {recipe.imageSource.uuidName !== '' && (
                <img
                    src={`${URL_PREFIX}/assets/${recipe.imageSource.uuidName}`}
                    alt={recipe.title}
                    style={{ width: '300px', height: 'auto' }}
                />
            )}
            <h2>Ingredients</h2>
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
