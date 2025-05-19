import { Link, Route, Routes } from 'react-router';
import AddRecipe from './AddRecipe';
import RecipeList from './RecipeList';
import { useState } from 'react';
import ViewRecipe from './ViewRecipe';

const App = () => {
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    return (
        <div className='App'>
            <Link to={'/'}>Cobbler</Link>

            {showSuccess && (
                <div>
                    <div>Recipe added successfully!</div>
                    <button onClick={() => setShowSuccess(false)}>X</button>
                </div>
            )}

            <div>
                <Routes>
                    <Route path='/' element={<RecipeList />} />
                    <Route
                        path='/add-recipe'
                        element={<AddRecipe setShowSuccess={setShowSuccess} />}
                    />
                    <Route path='/recipe/:id' element={<ViewRecipe />} />
                </Routes>
            </div>
        </div>
    );
};
export default App;
