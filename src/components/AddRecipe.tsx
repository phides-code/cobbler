import { useState } from 'react';
import type { ImageSource, Recipe } from '../types';
import { useNavigate } from 'react-router';
import ImageUploader from './ImageUploader';
import {
    useGetRecipesQuery,
    usePostRecipeMutation,
} from '../features/recipes/recipesApiSlice';

interface AddRecipeProps {
    setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddRecipe = ({ setShowSuccess }: AddRecipeProps) => {
    const initialRecipeState: Recipe = {
        author: '',
        title: '',
        description: '',
        tags: [],
        ingredients: [],
        steps: [],
        likes: 0,
        prepTime: '',
        imageSource: {
            originalName: '',
            uuidName: '',
        } as ImageSource,
    };

    const [newRecipe, setNewRecipe] = useState<Recipe>(initialRecipeState);
    const [newTag, setNewTag] = useState<string>('');
    const [newIngredient, setNewIngredient] = useState<string>('');
    const [newStep, setNewStep] = useState<string>('');

    const [postRecipe, { isLoading: isPostLoading, isError }] =
        usePostRecipeMutation();
    const { refetch, isFetching: isGetFetching } = useGetRecipesQuery();

    const isLoading = isPostLoading || isGetFetching;

    const navigate = useNavigate();

    const isFormIncomplete = () => {
        return Object.values(newRecipe).some((value) => {
            if (typeof value === 'string' && value.trim() === '') {
                return true;
            }

            if (Array.isArray(value) && value.length === 0) {
                return true;
            }

            return false;
        });
    };

    const handleInputChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
        field: keyof Recipe
    ) => {
        setNewRecipe({ ...newRecipe, [field]: event.target.value });
    };

    const handleArrayItemAdd = (
        newItem: string,
        setNewItem: React.Dispatch<React.SetStateAction<string>>,
        field: 'tags' | 'ingredients' | 'steps'
    ) => {
        if (newItem.trim()) {
            setNewRecipe((prev) => ({
                ...prev,
                [field]: [...prev[field], newItem.trim()],
            }));
            setNewItem('');
        }
    };

    const handleArrayItemRemove = (
        index: number,
        field: 'tags' | 'ingredients' | 'steps'
    ) => {
        setNewRecipe((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('submit recipe:', newRecipe);

        try {
            const postResult = await postRecipe(newRecipe).unwrap();

            if (postResult.errorMessage) {
                throw new Error(postResult.errorMessage);
            }

            await refetch();
            setShowSuccess(true);
            navigate('/');
        } catch (err) {
            console.error('Error creating new recipe: ', err);
        }
    };

    return (
        <div className='add-recipe-container'>
            <h3 className='add-recipe-title'>Add a Recipe:</h3>
            <form className='add-recipe-form' onSubmit={handleSubmit}>
                <div className='add-recipe-section'>
                    <label className='add-recipe-label'>Title:</label>
                    <input
                        className='add-recipe-input'
                        type='text'
                        value={newRecipe.title}
                        onChange={(e) => handleInputChange(e, 'title')}
                    />
                </div>
                <div className='add-recipe-section'>
                    <label className='add-recipe-label'>Description:</label>
                    <textarea
                        className='add-recipe-textarea'
                        value={newRecipe.description}
                        onChange={(e) => handleInputChange(e, 'description')}
                    />
                </div>
                <div className='add-recipe-section'>
                    <label className='add-recipe-label'>Prep Time:</label>
                    <input
                        className='add-recipe-input'
                        type='text'
                        placeholder='e.g., 30 minutes'
                        value={newRecipe.prepTime}
                        onChange={(e) => handleInputChange(e, 'prepTime')}
                    />
                </div>
                <div className='add-recipe-section'>
                    <label className='add-recipe-label'>Tags:</label>
                    <div className='add-recipe-inline'>
                        <div className='add-recipe-input-container'>
                            <input
                                className='add-recipe-input'
                                type='text'
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder='e.g., vegetarian, italian, etc.'
                            />
                        </div>
                        <button
                            className='add-recipe-btn'
                            type='button'
                            onClick={() =>
                                handleArrayItemAdd(newTag, setNewTag, 'tags')
                            }
                        >
                            Add Tag
                        </button>
                    </div>
                    <div className='add-recipe-tags'>
                        {newRecipe.tags.map((tag, index) => (
                            <span className='add-recipe-tag' key={index}>
                                {tag}
                                <button
                                    className='add-recipe-tag-remove'
                                    type='button'
                                    onClick={() =>
                                        handleArrayItemRemove(index, 'tags')
                                    }
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className='add-recipe-section'>
                    <label className='add-recipe-label'>Ingredients:</label>
                    <div className='add-recipe-inline'>
                        <div className='add-recipe-input-container'>
                            <input
                                className='add-recipe-input'
                                type='text'
                                value={newIngredient}
                                onChange={(e) =>
                                    setNewIngredient(e.target.value)
                                }
                                placeholder='e.g. 1 cup of flour'
                            />
                        </div>
                        <button
                            className='add-recipe-btn'
                            type='button'
                            onClick={() =>
                                handleArrayItemAdd(
                                    newIngredient,
                                    setNewIngredient,
                                    'ingredients'
                                )
                            }
                        >
                            Add Ingredient
                        </button>
                    </div>
                    <ul className='add-recipe-list'>
                        {newRecipe.ingredients.map((ingredient, index) => (
                            <li className='add-recipe-list-item' key={index}>
                                <span>{ingredient}</span>
                                <button
                                    className='add-recipe-list-remove'
                                    type='button'
                                    onClick={() =>
                                        handleArrayItemRemove(
                                            index,
                                            'ingredients'
                                        )
                                    }
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='add-recipe-section'>
                    <label className='add-recipe-label'>Steps:</label>
                    <div className='add-recipe-inline'>
                        <div className='add-recipe-input-container'>
                            <textarea
                                className='add-recipe-textarea add-recipe-step-textarea'
                                value={newStep}
                                onChange={(e) => setNewStep(e.target.value)}
                                placeholder='e.g. Preheat oven to 350°F'
                            />
                        </div>
                        <button
                            className='add-recipe-btn'
                            type='button'
                            onClick={() =>
                                handleArrayItemAdd(newStep, setNewStep, 'steps')
                            }
                        >
                            Add Step
                        </button>
                    </div>
                    <ul className='add-recipe-list'>
                        {newRecipe.steps.map((step, index) => (
                            <li className='add-recipe-list-item' key={index}>
                                <span>
                                    {index + 1}. {step}
                                </span>
                                <button
                                    className='add-recipe-list-remove'
                                    type='button'
                                    onClick={() =>
                                        handleArrayItemRemove(index, 'steps')
                                    }
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='add-recipe-section'>
                    <ImageUploader
                        recipe={newRecipe}
                        setRecipe={setNewRecipe}
                    />
                </div>
                <div className='add-recipe-section'>
                    <label className='add-recipe-label'>
                        Your Name or Handle:
                    </label>
                    <input
                        className='add-recipe-input'
                        type='text'
                        value={newRecipe.author}
                        onChange={(e) => handleInputChange(e, 'author')}
                    />
                </div>
                <div className='add-recipe-actions'>
                    <button
                        className='add-recipe-btn add-recipe-submit'
                        disabled={isFormIncomplete() || isLoading}
                        type='submit'
                    >
                        Submit
                    </button>
                    <button
                        className='add-recipe-btn add-recipe-cancel'
                        type='button'
                        onClick={() => navigate('/')}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
                {isError && (
                    <div className='add-recipe-error'>
                        Something went wrong while creating the recipe. Please
                        try again.
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddRecipe;
