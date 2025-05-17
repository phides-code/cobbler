import { useNavigate } from 'react-router';

const RecipeList = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div>Recipe List</div>
            <div>
                <button type='button' onClick={() => navigate('/add-recipe')}>
                    Add a recipe
                </button>
            </div>
        </div>
    );
};

export default RecipeList;
