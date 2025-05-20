import { useState } from 'react';
import type { ImageServiceAPIResponse, ImageSource, Recipe } from '../types';
import {
    IMAGE_SERVICE_API_KEY,
    IMAGE_SERVICE_URL,
    URL_PREFIX,
} from '../constants';

interface UploadedImageProps {
    imageSource: ImageSource;
    setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

const UploadedImage = ({ imageSource, setRecipe }: UploadedImageProps) => {
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const [fileRemovalError, setFileRemovalError] = useState<boolean>(false);

    const removeFileFromList = async (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        fileToRemove: ImageSource
    ) => {
        ev.preventDefault();

        setIsRemoving(true);

        try {
            const rawFetchResponse = await fetch(
                IMAGE_SERVICE_URL + '/' + fileToRemove.uuidName,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': IMAGE_SERVICE_API_KEY,
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
                setFileRemovalError(false);
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
            setFileRemovalError(true);
            console.error('removeFileFromList caught error: ', error);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div>
            <img
                src={`${URL_PREFIX}/assets/${imageSource.uuidName}`}
                alt={imageSource.originalName}
                style={{ height: '100px' }}
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
            {fileRemovalError && (
                <p>
                    Something went wrong while removing the image. Please try
                    again.
                </p>
            )}
        </div>
    );
};

export default UploadedImage;
