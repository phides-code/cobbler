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
        <div>
            <h3>Add a Recipe:</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type='text'
                        value={newRecipe.title}
                        onChange={(e) => handleInputChange(e, 'title')}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={newRecipe.description}
                        onChange={(e) => handleInputChange(e, 'description')}
                    />
                </div>
                <div>
                    <label>Prep Time:</label>
                    <input
                        type='text'
                        placeholder='e.g., 30 minutes'
                        value={newRecipe.prepTime}
                        onChange={(e) => handleInputChange(e, 'prepTime')}
                    />
                </div>

                <div>
                    <label>Tags:</label>
                    <div>
                        <input
                            type='text'
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder='e.g., vegetarian, italian, etc.'
                        />
                        <button
                            type='button'
                            onClick={() =>
                                handleArrayItemAdd(newTag, setNewTag, 'tags')
                            }
                        >
                            Add Tag
                        </button>
                    </div>
                    <div>
                        {newRecipe.tags.map((tag, index) => (
                            <span key={index}>
                                {tag}
                                <button
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

                <div>
                    <label>Ingredients:</label>
                    <div>
                        <input
                            type='text'
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            placeholder='e.g. 1 cup of flour'
                        />
                        <button
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
                    <ul>
                        {newRecipe.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient}
                                <button
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

                <div>
                    <label>Steps:</label>
                    <div>
                        <textarea
                            value={newStep}
                            onChange={(e) => setNewStep(e.target.value)}
                            placeholder='e.g. Preheat oven to 350°F'
                        />
                        <button
                            type='button'
                            onClick={() =>
                                handleArrayItemAdd(newStep, setNewStep, 'steps')
                            }
                        >
                            Add Step
                        </button>
                    </div>
                    <ul>
                        {newRecipe.steps.map((step, index) => (
                            <li key={index}>
                                {index + 1}. {step}
                                <button
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

                <div>
                    <ImageUploader
                        recipe={newRecipe}
                        setRecipe={setNewRecipe}
                    />
                </div>

                <div>
                    <label>Your Name or Handle:</label>
                    <input
                        type='text'
                        value={newRecipe.author}
                        onChange={(e) => handleInputChange(e, 'author')}
                    />
                </div>

                <div>
                    <button
                        disabled={isFormIncomplete() || isLoading}
                        type='submit'
                    >
                        Submit
                    </button>
                    <button
                        type='button'
                        onClick={() => navigate('/')}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
                <>
                    {isError && (
                        <div>
                            Something went wrong while creating the recipe.
                            Please try again.
                        </div>
                    )}
                </>
            </form>
        </div>
    );
};

export default AddRecipe;
