import { useState } from 'react';
import type { ImageSource, Recipe } from '../types';
import { useNavigate } from 'react-router';
import ImageUploader from './ImageUploader';

const AddRecipe = () => {
    const initialRecipeState: Recipe = {
        author: '',
        title: '',
        description: '',
        tags: [],
        ingredients: [],
        steps: [],
        likes: 0,
        prepTime: '',
        imageSource: {} as ImageSource,
    };

    const [recipe, setRecipe] = useState<Recipe>(initialRecipeState);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [newTag, setNewTag] = useState<string>('');
    const [newIngredient, setNewIngredient] = useState<string>('');
    const [newStep, setNewStep] = useState<string>('');

    const navigate = useNavigate();

    const isFormIncomplete = () => {
        return Object.values(recipe).some((value) => {
            if (typeof value === 'string' && value.trim() === '') {
                return true;
            }
            if (Array.isArray(value) && value.length === 0) {
                return true;
            }
            if (
                recipe.imageSource.originalName === '' ||
                recipe.imageSource.uuidName === ''
            ) {
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
        setRecipe({ ...recipe, [field]: event.target.value });
    };

    const handleArrayItemAdd = (
        newItem: string,
        setNewItem: React.Dispatch<React.SetStateAction<string>>,
        field: 'tags' | 'ingredients' | 'steps'
    ) => {
        if (newItem.trim()) {
            setRecipe((prev) => ({
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
        setRecipe((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('submit recipe:', recipe);
        setIsSubmitting(true);
        setRecipe(initialRecipeState);
        setIsSubmitting(false);
    };

    return (
        <div>
            <h3>Add a Recipe:</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type='text'
                        value={recipe.title}
                        onChange={(e) => handleInputChange(e, 'title')}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={recipe.description}
                        onChange={(e) => handleInputChange(e, 'description')}
                    />
                </div>
                <div>
                    <label>Prep Time:</label>
                    <input
                        type='text'
                        placeholder='e.g., 30 minutes'
                        value={recipe.prepTime}
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
                            placeholder='Add a tag, e.g., vegetarian, italian, etc.'
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
                        {recipe.tags.map((tag, index) => (
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
                            placeholder='Add an ingredient'
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
                        {recipe.ingredients.map((ingredient, index) => (
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
                            placeholder='Add a step'
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
                        {recipe.steps.map((step, index) => (
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
                    <ImageUploader recipe={recipe} setRecipe={setRecipe} />
                </div>

                <div>
                    <button
                        disabled={isFormIncomplete() || isSubmitting}
                        type='submit'
                    >
                        {isSubmitting ? '...' : 'Submit'}
                    </button>
                    <button type='button' onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRecipe;
