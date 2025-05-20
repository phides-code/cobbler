import { useState } from 'react';
import {
    useGetRecipeByIdQuery,
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

    const personOrPeople = currentLikes === 1 ? 'person' : 'people';

    const [putRecipe, { isLoading, isError }] = usePutRecipeMutation();
    const { refetch: refetchGetRecipes } = useGetRecipesQuery();
    const { refetch: refetchGetRecipeById } = useGetRecipeByIdQuery(id ?? '');

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
                refetchGetRecipes();
                refetchGetRecipeById();
            }
        } catch (err) {
            console.error('Error liking recipe: ', err);
        }
    };

    return (
        <div className='like-button-container'>
            <button
                type='button'
                disabled={isLoading}
                onClick={handleClick}
                className={`like-btn${liked ? ' liked' : ''}`}
            >
                {liked ? '❤️' : '🤍'}
            </button>
            {currentLikes > 0 && (
                <span className='like-count'>
                    {`${currentLikes} ${personOrPeople} ❤️ed this`}
                </span>
            )}
            {isError && (
                <p className='like-error'>
                    Something went wrong while ❤️ing the recipe. Please try
                    again later.
                </p>
            )}
        </div>
    );
};

export default LikeButton;
