import { ChangeEvent, useState } from 'react';
import { Ingredient, Recipe } from '../app/types';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

interface AddIngredientProps {
    setRecipe: React.Dispatch<React.SetStateAction<Partial<Recipe>>>;
}

const AddIngredient = ({ setRecipe }: AddIngredientProps) => {
    const initialIngredientState: Ingredient = {
        id: '',
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
                { ...newIngredient, id: uuidv4() },
            ],
        }));

        setNewIngredient(initialIngredientState);
    };

    return (
        <Wrapper>
            <IngredientContainer>
                <InputLabel>Quantity:</InputLabel>
                <Input
                    type='text'
                    name='quantity'
                    value={newIngredient.quantity}
                    onChange={handleInputChange}
                />
            </IngredientContainer>
            <IngredientContainer>
                <InputLabel>Unit:</InputLabel>
                <Input
                    type='text'
                    name='unit'
                    value={newIngredient.unit}
                    onChange={handleInputChange}
                />
            </IngredientContainer>
            <IngredientContainer>
                <InputLabel>Ingredient Name:</InputLabel>
                <Input
                    type='text'
                    name='ingredientName'
                    value={newIngredient.ingredientName}
                    onChange={handleInputChange}
                />
            </IngredientContainer>
            <IngredientContainer>
                <AddButton onClick={handleAddIngredient} disabled={disableAdd}>
                    Add
                </AddButton>
            </IngredientContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1.3rem;
    border-top: 0.06rem solid #555;
    padding-top: 1rem;
`;

const IngredientContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const InputLabel = styled.label`
    color: #555;
    margin-bottom: 0.3rem;
    min-width: 8.5rem;
`;

const Input = styled.input`
    padding: 0.5rem;
    border: 0.06rem solid #ccc;
    border-radius: 0.3rem;
    margin-bottom: 0.6rem;
    width: 100%;
`;

const AddButton = styled.button`
    padding: 0.6rem 1.3rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

export default AddIngredient;
