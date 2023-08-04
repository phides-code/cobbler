import styled from 'styled-components';
import ListRecipes from './ListRecipes';

const Home = () => {
    return (
        <Wrapper>
            <TopLabel>Recent recipes</TopLabel>
            <ListRecipes type='ALL' />
        </Wrapper>
    );
};

const Wrapper = styled.div``;

const TopLabel = styled.h2`
    padding-left: 0.6rem;
`;

export default Home;
