import { useState } from 'react';
import { useSearchRecipesQuery } from '../features/recipes/recipesApiSlice';
import { useDebounce } from '../app/hooks';
import { Link } from 'react-router';
import { truncateText } from '../utils/utils';

const TypeaheadSearch = () => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const { data, error, isLoading } = useSearchRecipesQuery(debouncedQuery, {
        skip: !debouncedQuery,
    });

    return (
        <div>
            <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Type to search...'
            />
            {isLoading && <p>Loading...</p>}
            {error && <p>Error fetching results.</p>}
            <ul>
                {data?.data?.map((recipe) => (
                    <li key={recipe.id}>
                        <div>
                            <Link to={`/recipe/${recipe.id}`}>
                                {recipe.title}
                            </Link>
                        </div>
                        <div>{truncateText(recipe.description, 50)}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TypeaheadSearch;
