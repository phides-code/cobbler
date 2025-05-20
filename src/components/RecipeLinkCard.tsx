import { Link } from 'react-router';
import { URL_PREFIX } from '../constants';

interface RecipeLinkCardProps {
    title: string;
    description: string;
    src: string;
    id: string;
    likes: number;
    isLikedByMe: boolean;
}

const RecipeLinkCard = ({
    title,
    description,
    src,
    id,
    likes,
    isLikedByMe,
}: RecipeLinkCardProps) => {
    const imgSrc = src !== '' ? src : 'placeholder.jpg';

    return (
        <Link to={`/recipe/${id}`}>
            <img
                src={`${URL_PREFIX}/assets/${imgSrc}`}
                alt={title}
                style={{ width: '100px', height: 'auto' }}
            />
            <h2>{title}</h2>
            <p>
                {likes} {isLikedByMe ? '❤️' : '🤍'}
            </p>
            <p>{description}</p>
        </Link>
    );
};

export default RecipeLinkCard;
