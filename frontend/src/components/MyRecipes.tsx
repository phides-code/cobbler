import { useContext, useEffect } from 'react';
import { UserContext } from '../app/UserContext';
import { useAppDispatch } from '../app/hooks';
import { selectRecipes } from '../features/recipes/recipesSlice';
import { useSelector } from 'react-redux';
import { fetchUser, selectUser } from '../features/user/userSlice';
import { fetchRecipesByIds } from '../features/recipes/recipesSlice';
import { Link } from 'react-router-dom';

const MyRecipes = () => {
    const dispatch = useAppDispatch();
    const { myId } = useContext(UserContext);

    const userState = useSelector(selectUser);
    const myRecipeIds = userState.user?.authoredRecipes;

    const myRecipesState = useSelector(selectRecipes);
    const myRecipes = myRecipesState.recipes;

    const isLoading: Boolean =
        userState.status === 'loading' || myRecipesState.status === 'failed';

    useEffect(() => {
        if (myId) {
            dispatch(fetchUser(myId));
        }
    }, [dispatch, myId]);

    useEffect(() => {
        if (myRecipeIds) {
            dispatch(fetchRecipesByIds(myRecipeIds));
        }
    }, [dispatch, myRecipeIds]);

    if (isLoading) return <div>...</div>;

    return (
        <div>
            <div>My recipes</div>
            <div>
                {myRecipes?.map((recipe) => (
                    <div key={recipe._id.toString()}>
                        <Link to={`/recipe/${recipe._id}`}>{recipe.title}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyRecipes;
