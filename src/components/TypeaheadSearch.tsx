import { useState } from 'react';
import { useSearchRecipesQuery } from '../features/recipes/recipesApiSlice';
import { useDebounce } from '../app/hooks';
import type { Recipe } from '../types';
import TypeaheadSearchResult from './TypeaheadSearchResult';

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

    if (error) {
        return (
            <div className='typeahead-search-error'>
                Error fetching results.
            </div>
        );
    }

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
                    {/* {error && (
                        <div className='typeahead-search-error'>
                            Error fetching results.
                        </div>
                    )} */}
                    {!isLoading &&
                        !error &&
                        recipes &&
                        recipes.length === 0 && (
                            <div className='typeahead-search-no-results'>
                                No recipes found.
                            </div>
                        )}
                    {recipes &&
                        recipes.map((recipe) => (
                            <TypeaheadSearchResult
                                key={recipe.id}
                                recipe={recipe}
                                setQuery={setQuery}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

export default TypeaheadSearch;
