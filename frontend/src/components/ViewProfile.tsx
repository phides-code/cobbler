import { Link, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { useEffect, useState } from 'react';
import { fetchUser, selectUser } from '../features/user/userSlice';
import { useSelector } from 'react-redux';
import ListRecipes from './ListRecipes';
import { RecipeListType } from '../app/types';
import styled from 'styled-components';

interface SwitchLinkProps {
    active: string;
}

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

    console.log(user);
    return (
        <Wrapper>
            <UserInfo>
                <StyledAvatar src={user?.picture} />
                <Nickname>{user?.nickname}</Nickname>
            </UserInfo>
            <RecipeListTypeSwitch>
                <SwitchLink
                    to='#'
                    active={(recipeListType === 'AUTHORED').toString()}
                    onClick={() => setRecipeListType('AUTHORED')}
                >
                    Authored recipes
                </SwitchLink>
                <SwitchLink
                    to='#'
                    active={(recipeListType === 'LIKED').toString()}
                    onClick={() => setRecipeListType('LIKED')}
                >
                    Liked recipes
                </SwitchLink>
            </RecipeListTypeSwitch>

            {recipeIds && (
                <ListRecipes type={recipeListType} recipeIds={recipeIds} />
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div``;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
`;

const StyledAvatar = styled.img`
    max-height: 2rem;
    border-radius: 50%;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
`;

const Nickname = styled.h2`
    font-weight: bold;
    color: #333;
`;

const RecipeListTypeSwitch = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 16px;
`;

const SwitchLink = styled(Link)<SwitchLinkProps>`
    font-size: 16px;
    text-decoration: none;
    color: ${(props) => (props.active === 'true' ? '#007bff' : '#333')};
    padding-bottom: 4px;
    border-bottom: 2px solid
        ${(props) => (props.active === 'true' ? '#007bff' : 'transparent')};
    margin-right: 16px;
    cursor: pointer;

    &:last-child {
        margin-right: 0;
    }

    &:hover {
        color: #007bff;
    }
`;

export default ViewProfile;
