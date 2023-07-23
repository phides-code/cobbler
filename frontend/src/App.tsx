import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import ViewRecipe from './components/ViewRecipe';
import ViewProfile from './components/ViewProfile';
import CreateRecipe from './components/CreateRecipe';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/recipe/:recipeId' element={<ViewRecipe />} />
                    <Route path='/user/:userId' element={<ViewProfile />} />
                    <Route path='/create' element={<CreateRecipe />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
