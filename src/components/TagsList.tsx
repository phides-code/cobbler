import { Link } from 'react-router';
import { useGetTagsQuery } from '../features/tags/tagsApiSlice';
import type { Tag } from '../types';

const TagsList = () => {
    const { data, isError } = useGetTagsQuery();
    if (isError) {
        return (
            <p className='error-text'>
                Something went wrong while loading the recipes. Please try
                again.
            </p>
        );
    }

    const tags = data?.data as Tag[];

    return (
        <div className='tags-list'>
            {tags &&
                tags.map((tag) => (
                    <Link to='#' key={tag.name} className='tags-list-link'>
                        {tag.name}{' '}
                        <span className='tags-list-count'>({tag.count})</span>
                    </Link>
                ))}
        </div>
    );
};

export default TagsList;
