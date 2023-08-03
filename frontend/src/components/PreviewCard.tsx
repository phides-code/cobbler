import styled from 'styled-components';
import { Recipe } from '../app/types';
import { useEffect } from 'react';
import {
    fetchNickname,
    selectNicknames,
} from '../features/nickname/nicknameSlice';
import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';

interface PreviewCardProps {
    recipe: Recipe;
}

const PreviewCard = ({ recipe }: PreviewCardProps) => {
    const dispatch = useAppDispatch();

    const { title, description, authorId, likedBy, type, cuisine } = recipe;
    const likes = likedBy?.length | 0;
    const nicknameState = useSelector(selectNicknames);
    const nickname = nicknameState.nickNameIdPairs[authorId as string];

    useEffect(() => {
        if (authorId) {
            dispatch(fetchNickname(authorId));
        }
    }, [authorId, dispatch]);
    return (
        <Wrapper>
            <Title>{title}</Title>
            <Cuisine>{cuisine}</Cuisine>
            <Description>{description}</Description>
            <Author>By {nickname}</Author>
            <Likes>{likes} Likes</Likes>
            <Type>{type.join(', ')}</Type>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 18.75rem;
    padding: 1.3rem;
    margin: 0.2rem;
    border-radius: 0.6rem;
    background-color: #fff;
    box-shadow: 0rem 0.3rem 0.5rem rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0rem 0.5rem 1rem rgba(0, 0, 0, 0.3);
    }
`;

const Title = styled.h2`
    margin-bottom: 0.6rem;
    color: #333;
`;

const Cuisine = styled.div`
    font-size: 1rem;
    color: #888;
    margin-bottom: 0.3rem;
`;

const Description = styled.p`
    font-size: 1rem;
    margin-bottom: 0.6rem;
    color: #555;
`;

const Author = styled.p`
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 0.3rem;
`;

const Likes = styled.p`
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 0.3rem;
`;

const Type = styled.p`
    font-size: 0.9rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.06rem;
`;

export default PreviewCard;
