import { Link } from 'react-router';
import type { Recipe } from '../types';
import { truncateText } from '../utils/utils';

interface TypeaheadSearchResultProps {
    recipe: Recipe;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const TypeaheadSearchResult = ({
    recipe,
    setQuery,
}: TypeaheadSearchResultProps) => {
    return (
        <Link
            to={`/recipe/${recipe.id}`}
            className='typeahead-search-result-item'
            key={recipe.id}
            onClick={() => setQuery('')}
        >
            <div className='typeahead-search-result-title'>{recipe.title}</div>
            <div className='typeahead-search-result-description'>
                {truncateText(recipe.description, 50)}
            </div>

            <div>
                {recipe.tags && recipe.tags.length > 0 ? (
                    <div className='typeahead-search-result-tags'>
                        {recipe.tags.map((tag) => (
                            <span
                                key={tag}
                                className='typeahead-search-result-tag'
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className='typeahead-search-result-no-tags'>
                        No tags
                    </span>
                )}
            </div>
        </Link>
    );
};

export default TypeaheadSearchResult;
