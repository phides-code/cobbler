import { Link, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { useEffect, useState } from 'react';
import { fetchUser, selectUser } from '../features/user/userSlice';
import { useSelector } from 'react-redux';
import ListRecipes from './ListRecipes';
import { RecipeListType } from '../app/types';
import styled from 'styled-components';

const ViewProfile = () => {
    const dispatch = useAppDispatch();
    const { userId } = useParams<{ userId: string }>();

    const [recipeListType, setRecipeListType] =
        useState<RecipeListType>('AUTHORED');

    const userState = useSelector(selectUser);
    const user = userState.user;

    const recipeIds =
        recipeListType === 'AUTHORED'
            ? (user?.authoredRecipes as string[])
            : (user?.likedRecipes as string[]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUser(userId));
        }
    }, [dispatch, userId]);

    return (
        <div>
            <div>User: {user?.nickname}</div>
            <RecipeListTypeSwitch>
                <Link
                    to='#'
                    onClick={() => {
                        setRecipeListType('AUTHORED');
                    }}
                >
                    Authored recipes
                </Link>
                <Link
                    to='#'
                    onClick={() => {
                        setRecipeListType('LIKED');
                    }}
                >
                    Liked recipes
                </Link>
            </RecipeListTypeSwitch>

            {recipeIds && (
                <ListRecipes type={recipeListType} recipeIds={recipeIds} />
            )}
        </div>
    );
};

const RecipeListTypeSwitch = styled.div`
    display: flex;
    justify-content: space-evenly;
`;

export default ViewProfile;
