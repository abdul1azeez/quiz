import React, { useState, useCallback } from 'react';

// A simple slugify function for cleaner URLs
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// Simple icon components for UI feedback
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-gray-400">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1.5">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const Spinner = () => (
    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function UploadArticle() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // 'idle', 'selected', 'uploading', 'success', 'error'
    const [message, setMessage] = useState('');
    const [articleUrl, setArticleUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // This handles both file input selection and drag-and-drop
    const handleFileChange = (selectedFile) => {
        if (selectedFile && selectedFile.type === 'application/zip') {
            setFile(selectedFile);
            setStatus('selected');
            setMessage('');
            setArticleUrl('');
        } else {
            setStatus('error');
            setMessage('Please select a valid .zip file.');
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        handleFileChange(droppedFile);
    };

    const handleCancel = () => {
        setFile(null);
        setStatus('idle');
        setMessage('');
        setArticleUrl('');
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        setMessage('');

        // Create a cleaner slug from the filename
        const baseFilename = file.name.substring(0, file.name.lastIndexOf('.zip'));
        const slug = slugify(baseFilename);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('slug', slug); // Send the preferred slug to the server

        try {
            const res = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            setStatus('success');
            setArticleUrl(data.urlPath); // Use the path returned from the server
            setMessage(data.message);
            setFile(null); // Clear the file
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'An unknown error occurred.');
        }
    };

    const renderStatusChip = () => {
        switch (status) {
            case 'uploading':
                return (
                    <div className="flex items-center justify-center w-full max-w-md px-4 py-3 font-medium text-white bg-blue-500 rounded-lg shadow-md">
                        <Spinner />
                        Uploading article...
                    </div>
                );
            case 'success':
                return (
                    <div className="flex items-center justify-center w-full max-w-md px-4 py-3 font-medium text-white bg-green-500 rounded-lg shadow-md">
                        <CheckIcon />
                        {message}
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center justify-center w-full max-w-md px-4 py-3 font-medium text-white bg-red-500 rounded-lg shadow-md">
                        <AlertIcon />
                        {message}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Upload Substack Article
                </h1>

                {status === 'idle' || status === 'error' ? (
                    <label
                        htmlFor="file-upload"
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center w-full h-48 px-4 transition bg-white border-2 border-dashed rounded-lg cursor-pointer ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        <UploadIcon />
                        <span className="mt-2 font-medium text-gray-600">
                            Drag & drop your .zip file
                        </span>
                        <span className="text-sm text-gray-500">or click to browse</span>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".zip"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                            className="hidden"
                        />
                    </label>
                ) : null}

                {status === 'selected' && file && (
                    <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FileIcon />
                                <span className="font-medium text-gray-700">{file.name}</span>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-red-500 font-bold text-xl"
                                title="Cancel"
                            >
                                &times;
                            </button>
                        </div>
                        <button
                            onClick={handleUpload}
                            className="w-full px-4 py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition"
                        >
                            Upload Article
                        </button>
                    </div>
                )}

                <div className="mt-6 flex flex-col items-center space-y-4">
                    {renderStatusChip()}

                    {status === 'success' && articleUrl && (
                        <div className="text-center p-4 bg-gray-100 rounded-lg w-full">
                            <p className="font-medium">View your article:</p>
                            <a
                                href={articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline break-all hover:text-blue-800"
                            >
                                {`http://localhost:5000${articleUrl}`}
                            </a>
                        </div>
                    )}

                    {(status === 'success' || status === 'error') && (
                        <button
                            onClick={handleCancel} // Resets the uploader
                            className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition"
                        >
                            {status === 'success' ? 'Upload Another' : 'Try Again'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
