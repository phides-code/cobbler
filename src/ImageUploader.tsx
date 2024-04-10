import styled from 'styled-components';
import type { ImageSource, Recipe } from './types';

interface ImageUploaderProps {
    recipe: Recipe;
    setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

const ImageUploader = ({ recipe, setRecipe }: ImageUploaderProps) => {
    const IMAGE_SERVICE_URL = import.meta.env.VITE_IMAGE_SERVICE_URL as string;

    const removeFileFromList = async (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        fileToRemove: ImageSource
    ) => {
        ev.preventDefault();

        const body = JSON.stringify({
            fileList: [fileToRemove.uuidName],
        });

        try {
            const rawFetchResponse = await fetch(IMAGE_SERVICE_URL, {
                method: 'DELETE',
                body,
            });

            const response = await rawFetchResponse.json();

            console.log('remove file:', fileToRemove);
            console.log('response:', response);
        } catch {
            console.log('removeFileFromList caught error');
        }

        setRecipe((recipe) => ({
            ...recipe,
            imageSources: recipe.imageSources.filter(
                (file) => file.uuidName !== fileToRemove.uuidName
            ),
        }));
    };

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

            try {
                const rawFetchResponse = await fetch(IMAGE_SERVICE_URL, {
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
                            // url: getFileUrl(uuidName),
                        }),
                    }));
                } else {
                    console.log('upload failed');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('An error occurred while uploading the file.');
            }
        };
    };

    const UploadedFileList = () => {
        const URL_PREFIX = import.meta.env.VITE_URL_PREFIX as string;

        return (
            <ul>
                {recipe.imageSources.map((file) => {
                    return (
                        <StyledLi key={file.uuidName}>
                            <StyledImg
                                src={`${URL_PREFIX}assets/${file.uuidName}`}
                                alt={file.originalName}
                            />
                            <BottomText>
                                <FileName>{file.originalName}</FileName>
                                <button
                                    onClick={(ev) => {
                                        removeFileFromList(ev, file);
                                    }}
                                >
                                    remove
                                </button>
                            </BottomText>
                        </StyledLi>
                    );
                })}
            </ul>
        );
    };

    return (
        <div>
            <label>Recipe Images:</label>
            <UploadedFileList />
            <StyledInput
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

const StyledLi = styled.li`
    display: flex;
    flex-direction: column;
`;

const StyledImg = styled.img`
    max-width: 8rem;
    height: auto;
    width: auto;
    border-radius: 10px;
`;

const BottomText = styled.div`
    display: flex;
`;

const FileName = styled.span`
    margin-right: 0.5rem;
`;

const StyledInput = styled.input``;

export default ImageUploader;
