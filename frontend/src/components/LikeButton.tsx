import styled from 'styled-components';
import { useAppDispatch } from '../app/hooks';
import { likeUnlikeRecipe } from '../features/recipe/recipeSlice';
import { useContext } from 'react';
import { UserContext } from '../app/UserContext';

interface LikeButtonProps {
    recipeId: string;
    recipeLikedBy: string[];
}

const LikeButton = ({ recipeId, recipeLikedBy }: LikeButtonProps) => {
    const dispatch = useAppDispatch();
    const { myId, isAuthenticated } = useContext(UserContext);

    const likedByMe = recipeLikedBy.includes(myId as string);

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
        <LikeCount>
            {`${recipeLikedBy.length} likes`}
            {isAuthenticated && (
                <button onClick={handleLikeButton}>
                    {likedByMe ? 'Unlike' : 'Like it!'}
                </button>
            )}
        </LikeCount>
    );
};

const LikeCount = styled.div`
    font-size: 14px;
    margin-bottom: 10px;
`;

export default LikeButton;
