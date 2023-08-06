import { useState } from 'react';
import { Recipe } from '../app/types';
import { deleteRecipe } from '../features/recipe/recipeSlice';
import { useAppDispatch } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface DeleteRecipeButtonProps {
    recipe: Recipe;
}

const DeleteRecipeButton = ({ recipe }: DeleteRecipeButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {
        setIsLoading(true);
        await dispatch(deleteRecipe(recipe as Recipe));
        setIsLoading(false);
        navigate(`/user/${recipe.authorId.toString()}`);
    };

    return (
        <DeleteButton disabled={isLoading} onClick={handleDelete}>
            Delete this recipe
        </DeleteButton>
    );
};

const DeleteButton = styled.button`
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
export default DeleteRecipeButton;
