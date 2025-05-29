import type { ImageSource, Recipe } from '../types';
import { URL_PREFIX } from '../constants';
import { useDeleteImageMutation } from '../features/image/imageApiSlice';

interface UploadedImageProps {
    imageSource: ImageSource;
    setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

const UploadedImage = ({ imageSource, setRecipe }: UploadedImageProps) => {
    const [deleteImage, { isError, isLoading }] = useDeleteImageMutation();

    const removeFileFromList = async (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        fileToRemove: ImageSource
    ) => {
        ev.preventDefault();

        try {
            const resultOfDelete = await deleteImage(
                fileToRemove.uuidName
            ).unwrap();

            if (resultOfDelete.errorMessage) {
                throw new Error(resultOfDelete.errorMessage);
            }

            if (
                (resultOfDelete.data as string).includes(fileToRemove.uuidName)
            ) {
                console.log('File removed successfully');

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
            console.error('removeFileFromList caught error: ', error);
        }
    };

    return (
        <div className='uploaded-image-container'>
            <img
                className='uploaded-image-preview'
                src={`${URL_PREFIX}/assets/${imageSource.uuidName}`}
                alt={imageSource.originalName}
            />
            <div className='uploaded-image-info'>
                <span className='uploaded-image-filename'>
                    {imageSource.originalName}
                </span>
                <button
                    className='uploaded-image-remove-btn'
                    disabled={isLoading}
                    onClick={(ev) => {
                        removeFileFromList(ev, imageSource);
                    }}
                >
                    remove
                </button>
            </div>
            {isError && (
                <p className='uploaded-image-error'>
                    Something went wrong while removing the image. Please try
                    again.
                </p>
            )}
        </div>
    );
};

export default UploadedImage;
