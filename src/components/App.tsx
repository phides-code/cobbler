import { Route, Routes } from 'react-router';
import AddRecipe from './AddRecipe';
import RecipeList from './RecipeList';
import { useState } from 'react';

const App = () => {
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    return (
        <div className='App'>
            <div>Cobbler</div>

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
                </Routes>
            </div>
        </div>
    );
};
export default App;
