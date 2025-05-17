import { useState } from 'react';
import type { ImageSource, Recipe } from '../types';

interface UploadedImageProps {
    imageSource: ImageSource;
    setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

const UploadedImage = ({ imageSource, setRecipe }: UploadedImageProps) => {
    const IMAGE_SERVICE_URL = import.meta.env.VITE_IMAGE_SERVICE_URL as string;
    const URL_PREFIX = import.meta.env.VITE_URL_PREFIX as string;
    const [isRemoving, setIsRemoving] = useState<boolean>(false);

    const removeFileFromList = async (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        fileToRemove: ImageSource
    ) => {
        ev.preventDefault();

        const body = JSON.stringify({
            fileList: [fileToRemove.uuidName],
        });

        setIsRemoving(true);

        try {
            const API_KEY = import.meta.env
                .VITE_IMAGE_SERVICE_API_KEY as string;
            const rawFetchResponse = await fetch(IMAGE_SERVICE_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                method: 'DELETE',
                body,
            });

            const response = await rawFetchResponse.json();

            console.log('remove file:', fileToRemove);
            console.log('response:', response);
            setRecipe((recipe) => ({
                ...recipe,
                imageSource: {
                    originalName: '',
                    uuidName: '',
                },
            }));
        } catch {
            console.log('removeFileFromList caught error');
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <li>
            <img
                src={`${URL_PREFIX}/assets/${imageSource.uuidName}`}
                alt={imageSource.originalName}
            />
            <div>
                <span>{imageSource.originalName}</span>
                <button
                    disabled={isRemoving}
                    onClick={(ev) => {
                        removeFileFromList(ev, imageSource);
                    }}
                >
                    remove
                </button>
            </div>
        </li>
    );
};

export default UploadedImage;
