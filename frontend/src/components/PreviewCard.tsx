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

    const { title, description, authorId, likedBy, type } = recipe;
    const likes = likedBy.length;
    const nicknameState = useSelector(selectNicknames);
    const nickname = nicknameState.nickNameIdPairs[authorId as string];

    useEffect(() => {
        if (authorId) {
            dispatch(fetchNickname(authorId));
        }
    }, [authorId, dispatch]);

    return (
        <Card>
            <Title>{title}</Title>
            <Description>{description}</Description>
            <Author>By {nickname}</Author>
            <Likes>{likes} Likes</Likes>
            <Type>{type.join(', ')}</Type>
        </Card>
    );
};

const Card = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-size: 20px;
    margin-bottom: 10px;
`;

const Description = styled.p`
    font-size: 16px;
    margin-bottom: 10px;
`;

const Author = styled.p`
    font-size: 14px;
    color: #888;
    margin-bottom: 5px;
`;

const Likes = styled.p`
    font-size: 14px;
    color: #888;
    margin-bottom: 5px;
`;

const Type = styled.p`
    font-size: 14px;
    color: #888;
`;

export default PreviewCard;
