import styled from 'styled-components';
import { useAppDispatch } from '../app/hooks';
import { likeUnlikeRecipe } from '../features/recipe/recipeSlice';
import { useContext } from 'react';
import { UserContext } from '../app/UserContext';

interface LikeButtonProps {
    recipeId: string;
    recipeLikedBy: string[];
}

interface LikeButtonStyledProps {
    backgroundcolor: string;
    hovercolor: string;
}

const LikeButton = ({ recipeId, recipeLikedBy }: LikeButtonProps) => {
    const dispatch = useAppDispatch();
    const { myId, isAuthenticated } = useContext(UserContext);

    const likedByMe = recipeLikedBy?.includes(myId as string);

    const likeCount = recipeLikedBy?.length | 0;

    const handleLikeButton = async () => {
        dispatch(
            likeUnlikeRecipe({
                recipeId: recipeId as string,
                type: likedByMe ? 'unlike' : 'like',
                userId: myId as string,
            })
        );
    };

    return (
        <LikeContainer>
            <LikeCount>{`${likeCount} likes`}</LikeCount>
            {isAuthenticated && (
                <LikeButtonStyled
                    onClick={handleLikeButton}
                    backgroundcolor={likedByMe ? '#dc3545' : '#007bff'}
                    hovercolor={likedByMe ? '#c82333' : '#0056b3'}
                    disabled={!isAuthenticated}
                >
                    {likedByMe ? 'Unlike' : 'Like it!'}
                </LikeButtonStyled>
            )}
        </LikeContainer>
    );
};

const LikeContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

const LikeCount = styled.div`
    font-size: 0.9rem;
    color: #888;
    margin-right: 1rem;
`;

const LikeButtonStyled = styled.button<LikeButtonStyledProps>`
    padding: 0.3rem 0.5rem;
    font-size: 0.9rem;
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    background-color: ${(props) => props.backgroundcolor};

    &:hover {
        background-color: ${(props) => props.hovercolor};
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

export default LikeButton;
