import { ReactNode, createContext, useEffect } from 'react';
import { User, useAuth0 } from '@auth0/auth0-react';

interface AuthState {
    user: User | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const UserContext = createContext<AuthState>({
    user: undefined,
    isAuthenticated: false,
    isLoading: false,
});

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    useEffect(() => {
        const createUserInDb = async () => {
            await fetch('/api/createUserInDb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...user }),
            });
        };

        if (isAuthenticated) {
            createUserInDb();
        }
    }, [isAuthenticated, user]);

    const UserContextValue: AuthState = {
        user,
        isAuthenticated,
        isLoading,
    };

    return (
        <UserContext.Provider value={UserContextValue}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
