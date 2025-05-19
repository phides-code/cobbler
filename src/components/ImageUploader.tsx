import { useState } from 'react';
import type { ImageServiceAPIResponse, Recipe } from '../types';
import UploadedImage from './UploadedImage';

interface ImageUploaderProps {
    recipe: Recipe;
    setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

const ImageUploader = ({ recipe, setRecipe }: ImageUploaderProps) => {
    const IMAGE_SERVICE_URL = import.meta.env.VITE_IMAGE_SERVICE_URL as string;
    const API_KEY = import.meta.env.VITE_IMAGE_SERVICE_API_KEY as string;

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<boolean>(false);

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList = ev.target.files as FileList;
        const file: File = files[0];

        if (!file.type.includes('image/')) {
            return;
        }

        uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        const originalName: string = file?.name as string;
        const fileExtension: string = originalName.split('.').pop() as string;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const result = reader.result as string;
            const imageData = result.split(',')[1]; // Extract base64 data

            const body = JSON.stringify({
                image: imageData,
                fileExt: fileExtension,
            });

            setIsUploading(true);

            try {
                const rawFetchResponse = await fetch(IMAGE_SERVICE_URL, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    method: 'POST',
                    body,
                });

                const response: ImageServiceAPIResponse =
                    await rawFetchResponse.json();

                if (response.errorMessage) {
                    throw new Error(response.errorMessage);
                }

                if ((response.data as string).includes(fileExtension)) {
                    console.log('File uploaded successfully');
                    setUploadError(false);
                    const uuidName = response.data as string;

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
                setUploadError(true);
                console.error('uploadFile caught error:', error);
            } finally {
                setIsUploading(false);
            }
        };
    };

    return (
        <div>
            <label>Recipe Image (optional):</label>
            {recipe.imageSource.uuidName ? (
                <UploadedImage
                    imageSource={recipe.imageSource}
                    setRecipe={setRecipe}
                />
            ) : (
                <input
                    disabled={isUploading}
                    type='file'
                    id='hide-upload-default-text'
                    onChange={handleFileChange}
                />
            )}
            <>
                {uploadError && (
                    <div>
                        Something went wrong while uploading the image. Please
                        try again.
                    </div>
                )}
            </>
        </div>
    );
};

export default ImageUploader;
