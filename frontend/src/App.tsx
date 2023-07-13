import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import MyRecipes from './components/MyRecipes';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/myrecipes' element={<MyRecipes />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
