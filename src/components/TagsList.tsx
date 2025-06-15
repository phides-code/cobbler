import { useContext, useMemo } from 'react';
import type { Recipe, Tag } from '../types';
import { SelectedTagsContext } from '../context/SelectedTagsContext';

interface TagsListProps {
    recipes: Recipe[];
}

const TagsList = ({ recipes }: TagsListProps) => {
    const { selectedTags, setSelectedTags } = useContext(SelectedTagsContext);

    const tags = useMemo(() => {
        const maxTags = 6;

        const tagCountMap: Record<string, number> = {};
        recipes.forEach((recipe) => {
            recipe.tags.forEach((tag) => {
                tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
            });
        });
        let tagsArr: Tag[] = Object.entries(tagCountMap).map(
            ([name, count]) => ({
                name,
                count,
            })
        );
        tagsArr.sort(
            (a, b) => b.count - a.count || a.name.localeCompare(b.name)
        );
        return tagsArr.slice(0, maxTags);
    }, [recipes]);

    const handleChange = (tagName: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagName)
                ? prev.filter((t) => t !== tagName)
                : [...prev, tagName]
        );
    };

    return (
        <div className='tags-list'>
            {tags.length > 0 &&
                tags.map((tag) => {
                    const checked = selectedTags.includes(tag.name);
                    return (
                        <label
                            key={tag.name}
                            className={`tags-list-item${checked ? ' checked' : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <input
                                type='checkbox'
                                checked={checked}
                                onChange={() => handleChange(tag.name)}
                                style={{
                                    position: 'absolute',
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    width: 0,
                                    height: 0,
                                }}
                                tabIndex={-1}
                            />
                            {tag.name}{' '}
                            <span className='tags-list-count'>
                                ({tag.count})
                            </span>
                        </label>
                    );
                })}
        </div>
    );
};

export default TagsList;
