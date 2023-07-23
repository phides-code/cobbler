import { ChangeEvent, useState } from 'react';
import { Ingredient, Recipe } from '../app/types';

interface AddIngredientProps {
    setRecipe: React.Dispatch<React.SetStateAction<Partial<Recipe>>>;
}

const AddIngredient = ({ setRecipe }: AddIngredientProps) => {
    const initialIngredientState: Ingredient = {
        quantity: '',
        unit: '',
        ingredientName: '',
    };
    const [newIngredient, setNewIngredient] = useState<Ingredient>(
        initialIngredientState
    );

    const disableAdd: boolean =
        newIngredient.ingredientName === '' ||
        newIngredient.quantity === '' ||
        newIngredient.unit === '';

    const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = ev.target;

        setNewIngredient((prevNewIngredient) => ({
            ...prevNewIngredient,
            [name]: value,
        }));
    };

    const handleAddIngredient = (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        ev.preventDefault();

        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            ingredients: [
                ...(prevRecipe.ingredients as Ingredient[]),
                newIngredient,
            ],
        }));

        setNewIngredient(initialIngredientState);
    };

    return (
        <>
            <div>
                <label>Quantity:</label>
                <input
                    type='text'
                    name='quantity'
                    value={newIngredient.quantity}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Unit:</label>
                <input
                    type='text'
                    name='unit'
                    value={newIngredient.unit}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Ingredient Name:</label>
                <input
                    type='text'
                    name='ingredientName'
                    value={newIngredient.ingredientName}
                    onChange={handleInputChange}
                />
            </div>
            <button onClick={handleAddIngredient} disabled={disableAdd}>
                Add
            </button>
        </>
    );
};

export default AddIngredient;
