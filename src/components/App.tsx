import { Route, Routes } from 'react-router';
import AddRecipe from './AddRecipe';
import RecipeList from './RecipeList';
import { useState } from 'react';
import ViewRecipe from './ViewRecipe';
import Header from './Header';
import { ThemeProvider } from '../context/ThemeContext';

const App = () => {
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    return (
        <ThemeProvider>
            <div className='App'>
                <Header />

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
                            element={
                                <AddRecipe setShowSuccess={setShowSuccess} />
                            }
                        />
                        <Route path='/recipe/:id' element={<ViewRecipe />} />
                    </Routes>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
