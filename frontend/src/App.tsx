import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import ViewRecipe from './components/ViewRecipe';
import ViewProfile from './components/ViewProfile';
import CreateRecipe from './components/CreateRecipe';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useEffect, useState } from 'react';

const App = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const detectMobile = () => {
            const isMobileDevice =
                /Mobi|Android|iPhone|iPod|iPad|Windows Phone/i.test(
                    navigator.userAgent
                );
            setIsMobile(isMobileDevice);
        };

        detectMobile();

        // Event listener to detect orientation change on mobile devices
        const handleOrientationChange = () => {
            detectMobile();
        };
        window.addEventListener('orientationchange', handleOrientationChange);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener(
                'orientationchange',
                handleOrientationChange
            );
        };
    }, []);

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div>
                <BrowserRouter>
                    <Header />
                    {isMobile ? 'mobile' : 'desktop'}
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route
                            path='/recipe/:recipeId'
                            element={<ViewRecipe />}
                        />
                        <Route path='/user/:userId' element={<ViewProfile />} />
                        <Route path='/create' element={<CreateRecipe />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </DndProvider>
    );
};

export default App;
