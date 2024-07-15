import { useState } from 'react';
import type { ImageSource, Recipe } from './types';
import styled from 'styled-components';
import ImageUploader from './ImageUploader';

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
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
        setIsSubmitting(true);
        setRecipe(initialRecipeState);
        setIsSubmitting(false);
    };

    console.log('recipe:', recipe);

    return (
        <FormContainer>
            <h3>Add a Recipe:</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <label>Title:</label>
                    <input
                        type=''
                        value={recipe.title}
                        onChange={(e) => handleInputChange(e, 'title')}
                    />
                </FormGroup>
                <FormGroup>
                    <label>Description:</label>
                    <input
                        type=''
                        value={recipe.description}
                        onChange={(e) => handleInputChange(e, 'description')}
                    />
                </FormGroup>

                <FormGroup>
                    <ImageUploader recipe={recipe} setRecipe={setRecipe} />
                </FormGroup>

                <FormGroup>
                    <button
                        disabled={isFormIncomplete() || isSubmitting}
                        type='submit'
                    >
                        {isSubmitting ? '...' : 'Submit'}
                    </button>
                    {/* {errorState && (
                        <ErrorMessage>something went wrong</ErrorMessage>
                    )}
                    {selectedProduct && (
                        <SuccessMessage>
                            successfully added {selectedProduct.name}
                        </SuccessMessage>
                    )} */}
                </FormGroup>
            </form>
        </FormContainer>
    );
};

// const SuccessMessage = styled.span`
//     color: green;
//     margin-left: 1rem;
// `;

// const ErrorMessage = styled.span`
//     color: red;
//     margin-left: 1rem;
// `;

const FormContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
    margin-bottom: 15px;

    label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }

    input,
    select {
        background-color: black;
        color: white;
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
`;

export default AddRecipe;
