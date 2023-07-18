import { ReactNode, createContext, useEffect, useState } from 'react';
import { User, useAuth0 } from '@auth0/auth0-react';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    myId: string | null;
}

const UserContext = createContext<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    myId: null,
});

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [myId, setMyId] = useState<string | null>();

    useEffect(() => {
        const createUserInDb = async () => {
            const rawResult = await fetch('/api/createUserInDb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...user }),
            });

            const result = await rawResult.json();

            setMyId(result.data._id ? result.data._id : result.data.insertedId);
        };

        console.log('run UserContext useEffect...');

        if (isAuthenticated) {
            createUserInDb();
        }
    }, [isAuthenticated, user]);

    const UserContextValue: AuthState = {
        user: user as User,
        isAuthenticated,
        isLoading,
        myId: myId as string,
    };

    return (
        <UserContext.Provider value={UserContextValue}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
