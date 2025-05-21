import { Link } from 'react-router';
import { URL_PREFIX } from '../constants';

interface RecipeLinkCardProps {
    title: string;
    description: string;
    src: string;
    id: string;
    likes: number;
    isLikedByMe: boolean;
    author: string;
}

const RecipeLinkCard = ({
    title,
    description,
    src,
    id,
    likes,
    isLikedByMe,
    author,
}: RecipeLinkCardProps) => {
    const imgSrc = src !== '' ? src : 'placeholder.jpg';

    const truncatedDescription =
        description.length > 110
            ? description.substring(0, 110) + '...'
            : description;

    return (
        <Link to={`/recipe/${id}`} className='recipe-link-card'>
            <img
                src={`${URL_PREFIX}/assets/${imgSrc}`}
                alt={title}
                className='recipe-card-image'
            />
            <h2 className='recipe-card-title'>{title}</h2>
            <div className='recipe-card-likes'>
                <span className='likes-count'>{likes}</span>{' '}
                <span className='likes-heart'>{isLikedByMe ? '❤️' : '🤍'}</span>
            </div>
            <p className='recipe-card-description'>{truncatedDescription}</p>
            <p className='recipe-card-author'>By {author}</p>
        </Link>
    );
};

export default RecipeLinkCard;
