import { useGetRecipesQuery } from '../features/recipes/recipesApiSlice';
import type { Recipe } from '../types';
import RecipeLinkCard from './RecipeLinkCard';
import { LOCAL_STORAGE_KEY } from '../constants';
import TagsList from './TagsList';

interface RecipeListProps {
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const RecipeList = ({ selectedTags, setSelectedTags }: RecipeListProps) => {
    const { data, isLoading, isFetching, isError } = useGetRecipesQuery();

    // Get liked recipes from localStorage
    const getLikedRecipeIds = (): string[] => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    };

    const likedRecipeIds = getLikedRecipeIds();

    if (isLoading || isFetching)
        return <p className='loading-text'>Loading recipes...</p>;
    if (isError) {
        return (
            <p className='error-text'>
                Something went wrong while loading the recipes. Please try
                again.
            </p>
        );
    }

    const recipes = data?.data as Recipe[];

    if (recipes.length === 0)
        return <p className='loading-text'>No recipes found</p>;

    const filteredRecipes = recipes.filter((recipe) => {
        // If no tags are selected, show all recipes
        if (selectedTags.length === 0) return true;

        // Check if recipe has all of the selected tags
        return selectedTags.every((tag) => recipe.tags.includes(tag));
    });

    return (
        <div className='recipe-list-container'>
            <TagsList
                recipes={filteredRecipes}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
            />
            <div className='recipe-grid'>
                {filteredRecipes.map((recipe) => (
                    <RecipeLinkCard
                        key={recipe.id}
                        id={recipe.id as string}
                        src={recipe.imageSource.uuidName}
                        title={recipe.title}
                        description={recipe.description}
                        likes={recipe.likes}
                        isLikedByMe={likedRecipeIds.includes(
                            recipe.id as string
                        )}
                        author={recipe.author}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecipeList;
