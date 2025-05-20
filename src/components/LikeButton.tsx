import { useState } from 'react';
import {
    useGetRecipesQuery,
    usePutRecipeMutation,
} from '../features/recipes/recipesApiSlice';
import { LOCAL_STORAGE_KEY } from '../constants';

interface LikeButtonProps {
    likes: number;
    id: string;
}

const LikeButton = ({ id, likes }: LikeButtonProps) => {
    // Get liked recipes from localStorage
    const getLikedRecipeIds = (): string[] => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    };

    const [liked, setLiked] = useState(() => getLikedRecipeIds().includes(id));
    const [currentLikes, setCurrentLikes] = useState(likes);

    const [putRecipe, { isLoading, isError }] = usePutRecipeMutation();
    const { refetch } = useGetRecipesQuery();

    const handleClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault();

        let offset: number;
        if (liked) {
            // Remove from localStorage
            const likedRecipeIds = getLikedRecipeIds().filter(
                (recipeId) => recipeId !== id
            );

            localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify(likedRecipeIds)
            );

            offset = -1;
        } else {
            // Add to localStorage
            const likedRecipeIds = getLikedRecipeIds();
            likedRecipeIds.push(id);

            localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify(likedRecipeIds)
            );

            offset = 1;
        }

        setCurrentLikes((currentLikes) => currentLikes + offset);

        try {
            const putResult = await putRecipe({
                id,
                likes: currentLikes + offset,
            }).unwrap();

            if (putResult.errorMessage) {
                throw new Error(putResult.errorMessage);
            } else {
                setLiked(!liked);
                refetch();
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
