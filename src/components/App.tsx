import { Link, Route, Routes, useNavigate } from 'react-router';
import AddRecipe from './AddRecipe';
import RecipeList from './RecipeList';
import { useState } from 'react';
import ViewRecipe from './ViewRecipe';

const App = () => {
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <div className='App'>
            <header className='app-header'>
                <div className='app-header-content'>
                    <div className='app-title-container'>
                        <Link to={'/'} className='app-title'>
                            Cobbler
                        </Link>
                        <div className='app-subtitle'>A Simple Recipe App</div>
                    </div>
                    <button
                        className='app-add-recipe-btn'
                        onClick={() => navigate('/add-recipe')}
                    >
                        Add a recipe
                    </button>
                </div>
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
