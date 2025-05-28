import React, { useState } from 'react';

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setSelectedFile(file);
        } else {
            alert('Please select a valid video file');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!selectedFile || !title.trim()) {
            alert('Please select a video file and enter a title');
            return;
        }

        setUploading(true);
        
        try {
            // Call your API upload function here
            // await uploadVideoToAPI(selectedFile, title, description, setUploadProgress);
            
            // Reset form on success
            setSelectedFile(null);
            setTitle('');
            setDescription('');
            setUploadProgress(0);
            alert('Video uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-page">
            <h1>Upload Video</h1>
            
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label htmlFor="video-file">Select Video File:</label>
                    <input
                        type="file"
                        id="video-file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                    {selectedFile && (
                        <p className="file-info">
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={uploading}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (optional):</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={uploading}
                        rows="4"
                    />
                </div>

                {uploading && (
                    <div className="upload-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={uploading || !selectedFile || !title.trim()}
                    className="upload-button"
                >
                    {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
            </form>
        </div>
    );
};

export default Upload;