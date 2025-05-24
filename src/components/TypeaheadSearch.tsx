import { useState } from 'react';
import { useSearchRecipesQuery } from '../features/recipes/recipesApiSlice';
import { useDebounce } from '../app/hooks';
import { Link } from 'react-router';
import { truncateText } from '../utils/utils';
import type { Recipe } from '../types';

const TypeaheadSearch = () => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const { data, error, isLoading } = useSearchRecipesQuery(debouncedQuery, {
        skip: !debouncedQuery,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setQuery('');
        }
    };

    const recipes = data?.data as Recipe[];

    return (
        <div className='typeahead-search-container'>
            <input
                type='text'
                className='typeahead-search-input'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Search recipes...'
            />
            {query && (
                <div className='typeahead-search-results'>
                    {isLoading && (
                        <div className='typeahead-search-loading'>
                            Searching...
                        </div>
                    )}
                    {error && (
                        <div className='typeahead-search-error'>
                            Error fetching results.
                        </div>
                    )}
                    {!isLoading && !error && recipes.length === 0 && (
                        <div className='typeahead-search-no-results'>
                            No recipes found.
                        </div>
                    )}
                    {recipes.map((recipe) => (
                        <Link
                            to={`/recipe/${recipe.id}`}
                            className='typeahead-search-result-item'
                            key={recipe.id}
                            onClick={() => setQuery('')}
                        >
                            <div className='typeahead-search-result-title'>
                                {recipe.title}
                            </div>
                            <div className='typeahead-search-result-description'>
                                {truncateText(recipe.description, 50)}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TypeaheadSearch;
