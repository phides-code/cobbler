import { useCallback } from 'react';
import { Ingredient, Recipe } from '../app/types';
import AddIngredient from './AddIngredient';
import { Card } from './Card';

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
                        <li>
                            {`${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientName} `}
                            <button
                                type='button'
                                onClick={() =>
                                    handleRemoveIngredient(ingredient)
                                }
                            >
                                X
                            </button>
                        </li>
                    }
                    moveCard={moveIngredient}
                />
            );
        },
        [setRecipe]
    );

    return (
        <div>
            <label>Ingredients:</label>
            <ul>
                {ingredients.map((ingredient, i) =>
                    renderIngredient(ingredient, i)
                )}
                <li>
                    <AddIngredient setRecipe={setRecipe} />
                </li>
            </ul>
        </div>
    );
};

export default ListIngredients;
