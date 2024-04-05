import { useState } from 'react';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files as FileList;
        setSelectedFile(fileList[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = async () => {
            const result = reader.result as string;
            const imageData = result.split(',')[1]; // Extract base64 data
            const fileExt = selectedFile.name.split('.').pop() as string;

            const body = JSON.stringify({
                image: imageData,
                fileExt: fileExt,
            });

            try {
                const response = await fetch('http://localhost:8000/upload', {
                    method: 'POST',
                    // body: formData,
                    body,

                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    mode: 'no-cors', // Set CORS mode
                });

                if (response.ok) {
                    alert('File uploaded successfully!');
                } else {
                    alert('File upload failed.');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('An error occurred while uploading the file.');
            }
        };
    };
    return (
        <div>
            <h1>File Upload Example</h1>
            <input type='file' onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
