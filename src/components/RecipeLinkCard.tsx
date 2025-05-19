import { Link } from 'react-router';

interface RecipeLinkCardProps {
    title: string;
    description: string;
    src: string;
    id: string;
}

const RecipeLinkCard = ({
    title,
    description,
    src,
    id,
}: RecipeLinkCardProps) => {
    const URL_PREFIX = import.meta.env.VITE_URL_PREFIX as string;

    const imgSrc = src !== '' ? src : 'placeholder.jpg';

    return (
        <Link to={`/recipe/${id}`}>
            <img
                src={`${URL_PREFIX}/assets/${imgSrc}`}
                alt={title}
                style={{ width: '100px', height: 'auto' }}
            />
            <h2>{title}</h2>
            <p>{description}</p>
        </Link>
    );
};

export default RecipeLinkCard;
