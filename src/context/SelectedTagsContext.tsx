import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

interface SelectedTagsState {
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectedTagsContext = createContext<SelectedTagsState>({
    selectedTags: [],
    setSelectedTags: () => {},
});

interface SelectedTagsProviderProps {
    children: ReactNode;
}

const SelectedTagsProvider = ({ children }: SelectedTagsProviderProps) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    return (
        <SelectedTagsContext.Provider value={{ selectedTags, setSelectedTags }}>
            {children}
        </SelectedTagsContext.Provider>
    );
};

export { SelectedTagsContext, SelectedTagsProvider };
