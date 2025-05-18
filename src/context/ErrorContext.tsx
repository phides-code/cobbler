import { createContext, useState } from 'react';

interface ErrorState {
    showError: boolean;
    setShowError: React.Dispatch<React.SetStateAction<boolean>>;
}

const ErrorContext = createContext<ErrorState>({
    showError: false,
    setShowError: () => {},
});

interface ErrorProviderProps {
    children: React.ReactNode;
}
const ErrorProvider = ({ children }: ErrorProviderProps) => {
    const [showError, setShowError] = useState<boolean>(false);

    return (
        <ErrorContext.Provider
            value={{ showError: showError, setShowError: setShowError }}
        >
            {children}
        </ErrorContext.Provider>
    );
};
export { ErrorContext, ErrorProvider };
