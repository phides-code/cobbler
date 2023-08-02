import styled from 'styled-components';
import { useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';
import { fetchUser, selectUser } from '../features/user/userSlice';
import { fetchRecipeById, selectRecipe } from '../features/recipe/recipeSlice';
import LikeButton from './LikeButton';
import { UserContext } from '../app/UserContext';
import DeleteRecipeButton from './DeleteRecipeButton';
import { Recipe } from '../app/types';

const ViewRecipe = () => {
    const dispatch = useAppDispatch();

    const { myId } = useContext(UserContext);
    const { recipeId } = useParams<{ recipeId: string }>();

    const recipesState = useSelector(selectRecipe);
    const recipe = recipesState.recipe;

    const userState = useSelector(selectUser);
    const author = userState.user;

    const isLoading = recipesState.status === 'loading';

    const myRecipe = author?._id.toString() === (myId as string);

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

    return (
        <RecipeContainer>
            <Title>{recipe?.title}</Title>
            <Description>{recipe?.description}</Description>
            <Author>
                by <Link to={`/user/${author?._id}`}>{author?.nickname}</Link>
            </Author>
            {recipeId && recipe && (
                <LikeButton
                    recipeId={recipeId as string}
                    recipeLikedBy={recipe?.likedBy as string[]}
                />
            )}
            <div>Ingredients:</div>
            <IngredientsContainer>
                {recipe?.ingredients.map((ingredient, i) => (
                    <IngredientItem key={ingredient.ingredientName + i}>
                        {`${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientName}`}
                    </IngredientItem>
                ))}
            </IngredientsContainer>
            <div>Steps:</div>
            <StepsContainer>
                {recipe?.steps.map((step) => (
                    <StepItem key={step.stepNumber}>
                        {`${step.stepNumber}. ${step.content}`}
                    </StepItem>
                ))}
            </StepsContainer>
            {myRecipe && <DeleteRecipeButton recipe={recipe as Recipe} />}
        </RecipeContainer>
    );
};

const RecipeContainer = styled.div`
    background-color: #f2f2f2;
    padding: 20px;
    border-radius: 10px;
`;

const Title = styled.div`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Description = styled.div`
    margin-bottom: 10px;
`;

const Author = styled.div`
    margin-bottom: 10px;
`;

const IngredientsContainer = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

const IngredientItem = styled.div`
    margin-bottom: 5px;
`;

const StepsContainer = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

const StepItem = styled.div`
    margin-bottom: 5px;
`;

export default ViewRecipe;
