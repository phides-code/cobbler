import type { ImageDataPayload, Recipe } from '../types';
import UploadedImage from './UploadedImage';
import { useUploadImageMutation } from '../features/image/imageApiSlice';

interface ImageUploaderProps {
    recipe: Recipe;
    setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

const ImageUploader = ({ recipe, setRecipe }: ImageUploaderProps) => {
    const [uploadImage, { isError, isLoading }] = useUploadImageMutation();

    const handleFileChange = async (
        ev: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files: FileList = ev.target.files as FileList;
        const file: File = files[0];

        if (!file || !file.type.includes('image/')) {
            return;
        }

        const originalName: string = file.name as string;
        const fileExtension: string = originalName.split('.').pop() as string;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const result = reader.result as string;
            const imageData = result.split(',')[1]; // Extract base64 data

            const body: ImageDataPayload = {
                image: imageData,
                fileExt: fileExtension,
            };

            try {
                const resultOfUpload = await uploadImage(body).unwrap();

                if (resultOfUpload.errorMessage) {
                    throw new Error(resultOfUpload.errorMessage);
                }

                if ((resultOfUpload.data as string).includes(fileExtension)) {
                    console.log('File uploaded successfully');
                    const uuidName = resultOfUpload.data as string;

                    setRecipe((recipe) => ({
                        ...recipe,
                        imageSource: {
                            originalName,
                            uuidName,
                        },
                    }));
                } else {
                    throw new Error('upload failed');
                }
            } catch (error) {
                console.error('uploadFile caught error:', error);
            }
        };
    };

    return (
        <div className='image-uploader-container'>
            <label className='image-uploader-label'>
                Recipe Image (optional):
            </label>
            {recipe.imageSource.uuidName ? (
                <UploadedImage
                    imageSource={recipe.imageSource}
                    setRecipe={setRecipe}
                />
            ) : (
                <input
                    className='image-uploader-input'
                    disabled={isLoading}
                    type='file'
                    id='hide-upload-default-text'
                    onChange={handleFileChange}
                />
            )}
            {isError && (
                <div className='image-uploader-error'>
                    Something went wrong while uploading the image. Please try
                    again.
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
