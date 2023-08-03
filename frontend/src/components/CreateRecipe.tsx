import styled from 'styled-components';
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
        <CoolForm>
            <Title>Create Recipe</Title>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor='title'>Title:</Label>
                    <Input
                        type='text'
                        id='title'
                        name='title'
                        value={recipe.title}
                        onChange={handleInputChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor='description'>Description:</Label>
                    <Textarea
                        id='description'
                        name='description'
                        value={recipe.description}
                        onChange={handleInputChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Type:</Label>
                    {foodTypes.map((foodType) => (
                        <CheckboxContainer key={foodType}>
                            <CheckboxInput
                                type='checkbox'
                                name='type'
                                value={foodType}
                                checked={recipe.type?.includes(foodType)}
                                onChange={handleInputChange}
                            />
                            <CheckboxLabel>{foodType}</CheckboxLabel>
                        </CheckboxContainer>
                    ))}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor='cuisine'>Cuisine:</Label>
                    <Select
                        id='cuisine'
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
                    </Select>
                </FormGroup>
                <ListIngredients
                    ingredients={recipe.ingredients as Ingredient[]}
                    setRecipe={setRecipe}
                />

                <ListSteps
                    setRecipe={setRecipe}
                    steps={recipe.steps as Step[]}
                />

                <SubmitButton type='submit' disabled={disableSubmit}>
                    Submit
                </SubmitButton>
            </form>
        </CoolForm>
    );
};

const CoolForm = styled.div`
    max-width: 31.25rem;
    margin: 0 auto;
    padding: 1.3rem;
    border-radius: 0.5rem;
    background-color: #f9f9f9;
    box-shadow: 0rem 0.3rem 0.5rem rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    color: #333;
    margin-bottom: 1.3rem;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1.3rem;
`;

const Label = styled.label`
    color: #555;
    margin-bottom: 0.3rem;
`;

const Input = styled.input`
    padding: 0.5rem;
    border: 0.06rem solid #ccc;
    border-radius: 0.3rem;
`;

const Textarea = styled.textarea`
    padding: 0.5rem;
    border: 0.06rem solid #ccc;
    border-radius: 0.3rem;
    resize: vertical;
`;

const CheckboxContainer = styled.label`
    display: flex;
    align-items: center;
    margin-right: 0.6rem;
`;

const CheckboxInput = styled.input`
    margin-right: 0.3rem;
`;

const CheckboxLabel = styled.span`
    color: #555;
`;

const Select = styled.select`
    padding: 0.5rem;
    border: 0.06rem solid #ccc;
    border-radius: 0.3rem;
`;

const SubmitButton = styled.button`
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

export default CreateRecipe;
