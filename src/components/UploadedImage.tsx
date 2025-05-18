import { useContext, useState } from 'react';
import type { ImageServiceAPIResponse, ImageSource, Recipe } from '../types';
import { ErrorContext } from '../context/ErrorContext';

interface UploadedImageProps {
    imageSource: ImageSource;
    setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

const UploadedImage = ({ imageSource, setRecipe }: UploadedImageProps) => {
    const IMAGE_SERVICE_URL = import.meta.env.VITE_IMAGE_SERVICE_URL as string;
    const URL_PREFIX = import.meta.env.VITE_URL_PREFIX as string;
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const { setShowError } = useContext(ErrorContext);

    const removeFileFromList = async (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        fileToRemove: ImageSource
    ) => {
        ev.preventDefault();

        setIsRemoving(true);

        try {
            const API_KEY = import.meta.env
                .VITE_IMAGE_SERVICE_API_KEY as string;
            const rawFetchResponse = await fetch(
                IMAGE_SERVICE_URL + '/' + fileToRemove.uuidName,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    method: 'DELETE',
                }
            );

            const response: ImageServiceAPIResponse =
                await rawFetchResponse.json();

            if (response.errorMessage) {
                throw new Error(response.errorMessage);
            }

            if ((response.data as string).includes(fileToRemove.uuidName)) {
                console.log('File removed successfully');
                setShowError(false);
                setRecipe((recipe) => ({
                    ...recipe,
                    imageSource: {
                        originalName: '',
                        uuidName: '',
                    },
                }));
            } else {
                throw new Error('delete failed');
            }
        } catch (error) {
            setShowError(true);
            console.error('removeFileFromList caught error: ', error);
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
