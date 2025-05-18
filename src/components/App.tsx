import { Route, Routes } from 'react-router';
import AddRecipe from './AddRecipe';
import RecipeList from './RecipeList';
import { useContext } from 'react';
import { ErrorContext } from '../context/ErrorContext';

const App = () => {
    const { showError, setShowError } = useContext(ErrorContext);

    return (
        <div className='App'>
            <div>
                <Routes>
                    <Route path='/' element={<RecipeList />} />
                    <Route path='/add-recipe' element={<AddRecipe />} />
                </Routes>
            </div>
            <div>
                {showError && (
                    <div
                        className='error'
                        style={{
                            color: 'red',
                        }}
                    >
                        Something went wrong. Please try again later.
                        <button
                            onClick={() => {
                                setShowError(false);
                            }}
                        >
                            X
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
