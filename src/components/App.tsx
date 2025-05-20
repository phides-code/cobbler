import { Link, Route, Routes } from 'react-router';
import AddRecipe from './AddRecipe';
import RecipeList from './RecipeList';
import { useState } from 'react';
import ViewRecipe from './ViewRecipe';

const App = () => {
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    return (
        <div className='App'>
            <header className='app-header'>
                <Link to={'/'} className='app-title'>
                    Cobbler
                </Link>
            </header>

            {showSuccess && (
                <div className='success-message-container'>
                    <span>✅ Recipe added successfully!</span>
                    <button
                        className='success-message-close-btn'
                        onClick={() => setShowSuccess(false)}
                    >
                        X
                    </button>
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
