import { useContext } from 'react';
import './App.css';
import { UserContext } from './app/UserContext';
import { LoginButton, LogoutButton } from './components/LoginLogoutButtons';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
    const { isAuthenticated, isLoading } = useContext(UserContext);

    return (
        <div>
            <BrowserRouter>
                <div>Cobbler</div>
                {isAuthenticated ? (
                    <>
                        <LogoutButton />
                    </>
                ) : (
                    <>{!isLoading && <LoginButton />}</>
                )}
            </BrowserRouter>
        </div>
    );
};

export default App;
