import { createContext, useState } from 'react';

interface DarkmodeState {
    isDarkmode: boolean;
    setIsDarkmode?: (isDarkmode: boolean) => void;
}

const DarkmodeContext = createContext<DarkmodeState>({
    isDarkmode: false,
    setIsDarkmode: () => {},
});

interface DarkmodeProviderProps {
    children: React.ReactNode;
}

const DarkmodeProvider = ({ children }: DarkmodeProviderProps) => {
    const [isDarkmode, setIsDarkmode] = useState<boolean>(false);

    return (
        <DarkmodeContext.Provider value={{ isDarkmode, setIsDarkmode }}>
            {children}
        </DarkmodeContext.Provider>
    );
};

export { DarkmodeContext, DarkmodeProvider };
