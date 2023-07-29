import { useContext, useState } from 'react';
import {
    FoodType,
    Ingredient,
    Recipe,
    Step,
    cuisines,
    foodTypes,
} from '../app/types';
import { UserContext } from '../app/UserContext';
import { useAppDispatch } from '../app/hooks';
import { createRecipe } from '../features/recipe/recipeSlice';
import { useNavigate } from 'react-router-dom';
import ListIngredients from './ListIngredients';
import ListSteps from './ListSteps';

const CreateRecipe = () => {
    const dispatch = useAppDispatch();

    const initialRecipeState: Partial<Recipe> = {
        title: '',
        description: '',
        type: [],
        cuisine: undefined,
        ingredients: [],
        steps: [],
    };

    const [recipe, setRecipe] = useState<Partial<Recipe>>(initialRecipeState);
    const [loading, setLoading] = useState<boolean>(false);

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

        const newRecipe = {
            ...recipe,
            authorId: myId,
        } as Partial<Recipe>;

        setLoading(true);
        await dispatch(createRecipe(newRecipe));
        setRecipe(initialRecipeState);
        setLoading(false);
        navigate(`/user/${myId}`);
    };

    const disableSubmit: boolean =
        !recipe.cuisine ||
        recipe.title === '' ||
        recipe.description === '' ||
        recipe.type?.length === 0 ||
        recipe.ingredients?.length === 0 ||
        recipe.steps?.length === 0 ||
        loading;

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
                    {foodTypes.map((foodType) => (
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
                        {cuisines.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <ListIngredients
                    ingredients={recipe.ingredients as Ingredient[]}
                    setRecipe={setRecipe}
                />

                <ListSteps
                    setRecipe={setRecipe}
                    steps={recipe.steps as Step[]}
                />

                <button type='submit' disabled={disableSubmit}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateRecipe;
