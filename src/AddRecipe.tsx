import { useState } from 'react';
import type { ImageSource, Recipe } from './types';

const AddRecipe = () => {
    const initialRecipeState: Recipe = {
        authorId: 'abc123',
        title: '',
        description: '',
        tags: [],
        ingredients: [],
        steps: [],
        likedBy: [],
        prepTime: '',
        cookingTime: '',
        portions: 0,
        allergens: [],
        difficulty: 'medium',
        ratings: [],
        imageSources: [],
    };

    const [recipe, setRecipe] = useState<Recipe>(initialRecipeState);

    const isFormIncomplete = () => {
        return Object.values(recipe).some((value) => {
            if (typeof value === 'string' && value.trim() === '') {
                return true; // Return true if any string field is empty or whitespace
            }

            const imageSources = recipe.imageSources as ImageSource[];
            if (imageSources.length === 0) {
                return true;
            }
            return false;
        });
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: keyof Recipe
    ) => {
        if (field === 'portions') {
            setRecipe({ ...recipe, [field]: parseInt(event.target.value) });
        } else {
            setRecipe({ ...recipe, [field]: event.target.value });
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        console.log('submit recipe:', recipe);
        setRecipe(initialRecipeState);
    };

    return <div></div>;
};

export default AddRecipe;
