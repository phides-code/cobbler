import { useState } from 'react';
import { Recipe } from '../app/types';
import { deleteRecipe } from '../features/recipe/recipeSlice';
import { useAppDispatch } from '../app/hooks';
import { useNavigate } from 'react-router-dom';

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
        <button disabled={isLoading} onClick={handleDelete}>
            Delete this recipe
        </button>
    );
};

export default DeleteRecipeButton;
