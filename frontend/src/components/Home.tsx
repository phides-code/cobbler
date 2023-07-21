import ListRecipes from './ListRecipes';

const Home = () => {
    return (
        <div>
            <div>Recent recipes</div>
            <div>
                <ListRecipes type='all' />
            </div>
        </div>
    );
};

export default Home;
