import { Route, Routes } from 'react-router';
import AddRecipe from './AddRecipe';
import RecipeList from './RecipeList';

const App = () => {
    return (
        <div className='App'>
            <Routes>
                <Route path='/' element={<RecipeList />} />
                <Route path='/add-recipe' element={<AddRecipe />} />
            </Routes>
        </div>
    );
};

export default App;
