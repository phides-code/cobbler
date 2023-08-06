import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../app/UserContext';
import { useSelector } from 'react-redux';
import {
    fetchRecipeById,
    selectRecipe,
    updateRecipe,
} from '../features/recipe/recipeSlice';
import { fetchUser, selectUser } from '../features/user/userSlice';
import {
    FoodType,
    Ingredient,
    Recipe,
    Step,
    cuisines,
    foodTypes,
} from '../app/types';
import styled from 'styled-components';
import ListIngredients from './ListIngredients';
import ListSteps from './ListSteps';

const EditRecipe = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { myId } = useContext(UserContext);
    const { recipeId } = useParams<{ recipeId: string }>();

    const recipesState = useSelector(selectRecipe);
    const recipe = recipesState.recipe as Recipe;

    const userState = useSelector(selectUser);
    const author = userState.user;

    const isLoading = recipesState.status === 'loading';

    const myRecipe = author?._id.toString() === (myId as string);

    const [editedRecipe, setEditedRecipe] = useState<Partial<Recipe>>(recipe);
    const [loading, setLoading] = useState<boolean>(false);

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
                ? [...(editedRecipe.type as FoodType[]), value] // Add the selected value to the array
                : editedRecipe.type?.filter((item) => item !== value); // Remove the unselected value from the array

            setEditedRecipe((prevRecipe) => ({
                ...prevRecipe,
                [name]: updatedType,
            }));
        } else {
            // For other inputs, directly set the value in the state
            setEditedRecipe((prevRecipe) => ({ ...prevRecipe, [name]: value }));
        }
    };

    const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const newEditedRecipe = {
            ...editedRecipe,
            authorId: myId,
        } as Recipe;

        setLoading(true);
        dispatch(updateRecipe(newEditedRecipe));
        setLoading(false);
        navigate(`/recipe/${newEditedRecipe._id.toString()}`);
    };

    const disableSubmit: boolean =
        !editedRecipe.cuisine ||
        editedRecipe.title === '' ||
        editedRecipe.description === '' ||
        editedRecipe.type?.length === 0 ||
        editedRecipe.ingredients?.length === 0 ||
        editedRecipe.steps?.length === 0 ||
        loading;

    useEffect(() => {
        if (recipeId) {
            dispatch(fetchRecipeById(recipeId));
        }
    }, [dispatch, recipeId]);

    useEffect(() => {
        if (recipe) {
            dispatch(fetchUser(recipe.authorId));
        }
    }, [dispatch, recipe]);

    if (isLoading) return <div>...</div>;

    if (!myRecipe) return <div>Unable to edit</div>;

    return (
        <Wrapper>
            <Title>Edit Recipe</Title>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor='title'>Title:</Label>
                    <Input
                        type='text'
                        id='title'
                        name='title'
                        value={editedRecipe.title}
                        onChange={handleInputChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor='description'>Description:</Label>
                    <Textarea
                        id='description'
                        name='description'
                        value={editedRecipe.description}
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
                                checked={editedRecipe.type?.includes(foodType)}
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
                        value={editedRecipe.cuisine}
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
                    ingredients={editedRecipe.ingredients as Ingredient[]}
                    setRecipe={setEditedRecipe}
                />

                <ListSteps
                    setRecipe={setEditedRecipe}
                    steps={editedRecipe.steps as Step[]}
                />

                <SaveCancelButtons>
                    <SubmitButton type='submit' disabled={disableSubmit}>
                        Save
                    </SubmitButton>
                    <CancelButton
                        type='button'
                        onClick={() => {
                            navigate(`/recipe/${recipe._id.toString()}`);
                        }}
                    >
                        Cancel
                    </CancelButton>
                </SaveCancelButtons>
            </form>
        </Wrapper>
    );
};

const Wrapper = styled.div`
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

const CancelButton = styled.button`
    padding: 0.6rem 1.3rem;
    color: #fff;
    background-color: #dc3545;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;

    &:hover {
        background-color: #c82333;
    }
`;

const SaveCancelButtons = styled.div`
    display: flex;
    justify-content: space-evenly;
`;

export default EditRecipe;
