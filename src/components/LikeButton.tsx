import { useState } from 'react';
import {
    useGetRecipesQuery,
    usePutRecipeMutation,
} from '../features/recipes/recipesApiSlice';

interface LikeButtonProps {
    likes: number;
    id: string;
}

const LikeButton = ({ id, likes }: LikeButtonProps) => {
    const [liked, setLiked] = useState(false);
    const [currentLikes, setCurrentLikes] = useState(likes);

    const [putRecipe, { isLoading, isError }] = usePutRecipeMutation();
    const { refetch } = useGetRecipesQuery();

    const handleClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const offset = liked ? -1 : 1;
        setCurrentLikes((currentLikes) => currentLikes + offset);
        event.preventDefault();

        try {
            const putResult = await putRecipe({
                id,
                likes: currentLikes + offset,
            }).unwrap();

            if (putResult.errorMessage) {
                throw new Error(putResult.errorMessage);
            } else {
                refetch();
                setLiked(!liked);
            }
        } catch (err) {
            console.error('Error liking recipe: ', err);
        }
    };

    return (
        <div>
            <button type='button' disabled={isLoading} onClick={handleClick}>
                {liked ? '❤️ This' : '🤍 This'}
            </button>
            <span>{currentLikes} people ❤️ this</span>
            {isError && (
                <p>
                    Something went wrong while ❤️ing the recipe. Please try
                    again later.
                </p>
            )}
        </div>
    );
};

export default LikeButton;
