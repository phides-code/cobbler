import styled from 'styled-components';
import type { Recipe } from './types';
import { useState } from 'react';
import UploadedImage from './UploadedImage';

interface ImageUploaderProps {
    recipe: Recipe;
    setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

const ImageUploader = ({ recipe, setRecipe }: ImageUploaderProps) => {
    const IMAGE_SERVICE_URL = import.meta.env.VITE_IMAGE_SERVICE_URL as string;

    const [isUploading, setIsUploading] = useState<boolean>(false);

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
                const API_KEY = import.meta.env
                    .VITE_IMAGE_SERVICE_API_KEY as string;
                const rawFetchResponse = await fetch(IMAGE_SERVICE_URL, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    method: 'POST',
                    body,
                });

                const response = await rawFetchResponse.json();

                if (!response.error && response.data.includes(fileExtension)) {
                    console.log('File uploaded successfully');
                    const uuidName = response.data;

                    setRecipe((recipe) => ({
                        ...recipe,
                        imageSources: recipe.imageSources.concat({
                            originalName,
                            uuidName,
                        }),
                    }));
                } else {
                    console.log('upload failed');
                }
            } catch (error) {
                console.error('uploadFile caught error:', error);
            } finally {
                setIsUploading(false);
            }
        };
    };

    const UploadedFileList = () => (
        <ul>
            {recipe.imageSources.map((imageSource) => (
                <UploadedImage
                    key={imageSource.uuidName}
                    imageSource={imageSource}
                    setRecipe={setRecipe}
                />
            ))}
            {isUploading && <li>...</li>}
        </ul>
    );

    return (
        <div>
            <label>Recipe Images:</label>
            <UploadedFileList />
            <StyledInput
                disabled={isUploading}
                type='file'
                id='hide-upload-default-text'
                onChange={handleFileChange}
            />
        </div>
    );
};

// const StyledLink = styled(Link)`
//     color: deepskyblue;
//     text-decoration: none;
// `;

const StyledInput = styled.input``;

export default ImageUploader;
