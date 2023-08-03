import { useCallback } from 'react';
import { Ingredient, Recipe } from '../app/types';
import AddIngredient from './AddIngredient';
import { Card } from './Card';
import styled from 'styled-components';

interface ListIngredientsProps {
    ingredients: Ingredient[];
    setRecipe: React.Dispatch<React.SetStateAction<Partial<Recipe>>>;
}

const ListIngredients = ({ ingredients, setRecipe }: ListIngredientsProps) => {
    const renderIngredient = useCallback(
        (ingredient: Ingredient, index: number) => {
            const moveIngredient = (dragIndex: number, hoverIndex: number) => {
                setRecipe((prevRecipe) => {
                    const clonedIngredients = [
                        ...(prevRecipe.ingredients as Ingredient[]),
                    ];
                    const [draggedIngredient] = clonedIngredients.splice(
                        dragIndex,
                        1
                    );
                    clonedIngredients.splice(hoverIndex, 0, draggedIngredient);

                    return {
                        ...prevRecipe,
                        ingredients: clonedIngredients,
                    };
                });
            };

            const handleRemoveIngredient = (ingredientToRemove: Ingredient) => {
                setRecipe((prevRecipe) => ({
                    ...prevRecipe,
                    ingredients: prevRecipe.ingredients?.filter(
                        (ingredient) => ingredient !== ingredientToRemove
                    ),
                }));
            };

            return (
                <Card
                    key={ingredient.id}
                    index={index}
                    id={ingredient.id}
                    content={
                        <IngredientItem key={ingredient.id}>
                            <ItemWrapper>
                                <div>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientName} `}</div>

                                <div>
                                    <RemoveButton
                                        type='button'
                                        onClick={() =>
                                            handleRemoveIngredient(ingredient)
                                        }
                                    >
                                        X
                                    </RemoveButton>
                                </div>
                            </ItemWrapper>
                        </IngredientItem>
                    }
                    moveCard={moveIngredient}
                />
            );
        },
        [setRecipe]
    );

    return (
        <div>
            <Label>Ingredients:</Label>
            <IngredientsList>
                {ingredients.map((ingredient, i) =>
                    renderIngredient(ingredient, i)
                )}
                <li>
                    <AddIngredient setRecipe={setRecipe} />
                </li>
            </IngredientsList>
        </div>
    );
};

const ItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const IngredientsList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const IngredientItem = styled.li`
    color: #555;
    margin-bottom: 0.3rem;
`;

const RemoveButton = styled.button`
    padding: 0.3rem 0.6rem;
    color: #fff;
    background-color: #dc3545;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;

    &:hover {
        background-color: #c82333;
    }
`;

const Label = styled.label`
    color: #555;
    margin-bottom: 0.3rem;
`;

export default ListIngredients;
