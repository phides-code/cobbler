import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { useEffect } from 'react';
import { fetchUser, selectUser } from '../features/user/userSlice';
import { useSelector } from 'react-redux';
import ListRecipes from './ListRecipes';

const ViewProfile = () => {
    const dispatch = useAppDispatch();
    const { userId } = useParams<{ userId: string }>();

    const userState = useSelector(selectUser);
    const user = userState.user;
    const authoredRecipeIds = user?.authoredRecipes as string[];
    const likedRecipeIds = user?.likedRecipes as string[];

    useEffect(() => {
        if (userId) {
            dispatch(fetchUser(userId));
        }
    }, [dispatch, userId]);

    return (
        <div>
            <div>User: {user?.nickname}</div>
            <div>Authored recipes:</div>
            <ListRecipes type='authored' recipeIds={authoredRecipeIds} />

            <div>Liked recipes:</div>
            <ListRecipes type='liked' recipeIds={likedRecipeIds} />
        </div>
    );
};

export default ViewProfile;
