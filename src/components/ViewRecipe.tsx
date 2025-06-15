import { useParams, useNavigate } from 'react-router';
import { useGetRecipeByIdQuery } from '../features/recipes/recipesApiSlice';
import LikeButton from './LikeButton';
import { URL_PREFIX } from '../constants';
import { useContext } from 'react';
import { SelectedTagsContext } from '../context/SelectedTagsContext';

const ViewRecipe = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, isError } = useGetRecipeByIdQuery(id ?? '');
    const { setSelectedTags } = useContext(SelectedTagsContext);
    const navigate = useNavigate();

    const handleTagClick = (tag: string) => {
        setSelectedTags([tag]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate('/', { replace: true });
    };

    if (isLoading) {
        return <p className='loading-text'>Loading...</p>;
    }

    if (isError || !data || !data.data) {
        return <p className='error-text'>Recipe not found.</p>;
    }

    const recipe = data.data;

    return (
        <div className='view-recipe-container'>
            {recipe.imageSource.uuidName !== '' && (
                <div className='view-recipe-image-wrapper'>
                    <img
                        src={`${URL_PREFIX}/assets/${recipe.imageSource.uuidName}`}
                        alt={recipe.title}
                        className='view-recipe-image'
                    />
                </div>
            )}
            <h1 className='view-recipe-title'>{recipe.title}</h1>
            <p className='view-recipe-description'>{recipe.description}</p>
            <p className='view-recipe-author'>By {recipe.author}</p>
            {recipe.tags && recipe.tags.length > 0 && (
                <div className='tags-list'>
                    {recipe.tags.map((tag, idx) => (
                        <button
                            type='button'
                            onClick={() => handleTagClick(tag)}
                            className='tags-list-item'
                            key={idx}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}
            <div className='view-recipe-preptime'>
                Prep Time: {recipe.prepTime}
            </div>
            <div className='view-recipe-likes-row'>
                <LikeButton id={recipe.id as string} likes={recipe.likes} />
            </div>
            <div className='view-recipe-details'>
                <div className='view-recipe-ingredients'>
                    <h2>Ingredients</h2>
                    <ul className='view-recipe-ingredients-list'>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className='view-recipe-steps'>
                    <h2>Instructions</h2>
                    <ol className='view-recipe-steps-list'>
                        {recipe.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ViewRecipe;
