import { useContext, useState } from 'react';
import {
    Cuisine,
    FoodType,
    Ingredient,
    Recipe,
    Step,
    cuisines,
    foodTypes,
} from '../app/types';
import AddIngredient from './AddIngredient';
import AddStep from './AddStep';
import { UserContext } from '../app/UserContext';
import { useAppDispatch } from '../app/hooks';
import { createRecipe } from '../features/recipe/recipeSlice';
import { useNavigate } from 'react-router-dom';

const CreateRecipe = () => {
    const dispatch = useAppDispatch();

    const initialRecipeState: Partial<Recipe> = {
        title: '',
        description: '',
        type: [],
        cuisine: '',
        ingredients: [],
        steps: [],
    };

    const [recipe, setRecipe] = useState<Partial<Recipe>>(initialRecipeState);
    const [loading, setLoading] = useState<boolean>(false);

    const foodTypeOptions: FoodType[] = foodTypes;
    const cuisineOptions: Cuisine[] = cuisines;

    const { myId } = useContext(UserContext);

    const navigate = useNavigate();

    const handleInputChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = event.target;

        if (type === 'checkbox') {
            const inputElement = event.target as HTMLInputElement; // Type assertion to cast event.target to HTMLInputElement
            const checked = inputElement.checked; // Get the "checked" property from the inputElement

            const updatedType = checked
                ? [...(recipe.type as FoodType[]), value] // Add the selected value to the array
                : recipe.type?.filter((item) => item !== value); // Remove the unselected value from the array

            setRecipe((prevRecipe) => ({ ...prevRecipe, [name]: updatedType }));
        } else {
            // For other inputs, directly set the value in the state
            setRecipe((prevRecipe) => ({ ...prevRecipe, [name]: value }));
        }
    };

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setLoading(true);

        const newRecipe = {
            ...recipe,
            authorId: myId,
        } as Partial<Recipe>;

        await dispatch(createRecipe(newRecipe));

        setRecipe(initialRecipeState);
        setLoading(false);

        navigate(`/user/${myId}`);
    };

    const disableSubmit: boolean =
        recipe.cuisine === '' ||
        recipe.title === '' ||
        recipe.description === '' ||
        recipe.type?.length === 0 ||
        loading;

    const handleRemoveIngredient = (ingredientToRemove: Ingredient) => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            ingredients: prevRecipe.ingredients?.filter(
                (ingredient) => ingredient !== ingredientToRemove
            ),
        }));
    };

    const handleRemoveStep = (stepToRemove: Step) => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            steps: prevRecipe.steps
                ?.filter((step) => step !== stepToRemove)
                .map((step, i) => ({
                    content: step.content,
                    stepNumber: i + 1,
                })),
        }));
    };

    return (
        <div>
            <div>Create</div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type='text'
                        name='title'
                        value={recipe.title}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Description:</label>
                    <textarea
                        name='description'
                        value={recipe.description}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Type:</label>
                    {foodTypeOptions.map((foodType) => (
                        <label key={foodType}>
                            <input
                                type='checkbox'
                                name='type'
                                value={foodType}
                                checked={recipe.type?.includes(foodType)}
                                onChange={handleInputChange}
                            />
                            {foodType}
                        </label>
                    ))}
                </div>

                <div>
                    <label>Cuisine:</label>
                    <select
                        name='cuisine'
                        value={recipe.cuisine}
                        onChange={handleInputChange}
                    >
                        <option value=''>Select Cuisine</option>
                        {cuisineOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Ingredients:</label>
                    <ul>
                        {recipe.ingredients?.map((ingredient, i) => (
                            <li key={ingredient.ingredientName + i}>
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
                        ))}
                        <li>
                            <AddIngredient setRecipe={setRecipe} />
                        </li>
                    </ul>
                </div>

                <div>
                    <label>Steps:</label>
                    <ol>
                        {recipe.steps?.map((step, i) => (
                            <li key={step.stepNumber + i}>
                                {`${step.content} `}
                                <button
                                    type='button'
                                    onClick={() => handleRemoveStep(step)}
                                >
                                    X
                                </button>
                            </li>
                        ))}
                        <li>
                            <AddStep
                                setRecipe={setRecipe}
                                numberOfSteps={recipe.steps?.length as number}
                            />
                        </li>
                    </ol>
                </div>

                <button type='submit' disabled={disableSubmit}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateRecipe;
