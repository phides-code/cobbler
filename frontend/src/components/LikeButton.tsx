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
        <LikeCount>
            {`${likeCount} likes`}
            {isAuthenticated && (
                <button onClick={handleLikeButton}>
                    {likedByMe ? 'Unlike' : 'Like it!'}
                </button>
            )}
        </LikeCount>
    );
};

const LikeCount = styled.div`
    font-size: 0.9rem;

    margin-bottom: 0.6rem;
`;

export default LikeButton;
