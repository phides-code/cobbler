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
            <Author>
                by <Link to={`/user/${author?._id}`}>{author?.nickname}</Link>
            </Author>
            <TypeAndCuisine>
                <Type>Type: {recipe?.type.join(', ')}</Type>
                <Cuisine>Cuisine: {recipe?.cuisine}</Cuisine>
            </TypeAndCuisine>
            <Description>{recipe?.description}</Description>
            {recipeId && recipe && (
                <LikeButton
                    recipeId={recipeId as string}
                    recipeLikedBy={recipe?.likedBy as string[]}
                />
            )}
            <SectionTitle>Ingredients:</SectionTitle>
            <IngredientsContainer>
                {recipe?.ingredients.map((ingredient, i) => (
                    <IngredientItem key={ingredient.ingredientName + i}>
                        {`${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientName}`}
                    </IngredientItem>
                ))}
            </IngredientsContainer>
            <SectionTitle>Steps:</SectionTitle>
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
    background-color: #f9f9f9;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-weight: bold;
    margin-bottom: 0.8rem;
    color: #333;
`;

const Description = styled.p`
    color: #555;
    margin-bottom: 1rem;
`;

const Author = styled.p`
    color: #888;
    margin-bottom: 1rem;
`;

const TypeAndCuisine = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 1rem;
`;

const Type = styled.div`
    color: #555;
    background-color: #f2f2f2;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
`;

const Cuisine = styled.div`
    color: #555;
    background-color: #f2f2f2;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
`;

const IngredientsContainer = styled.div`
    margin-top: 1rem;
`;

const IngredientItem = styled.div`
    color: #555;
    margin-bottom: 0.6rem;
`;

const StepsContainer = styled.div`
    margin-top: 1rem;
`;

const StepItem = styled.div`
    color: #555;
    margin-bottom: 0.6rem;
`;

const SectionTitle = styled.div`
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
`;

export default ViewRecipe;
