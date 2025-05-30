import React, { useState } from 'react';
import Navbar from '../../components/header/navbar';
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
        <div className="min-h-screen bg-base-200 p-4">
        <Navbar/>
        <br/>
            <div className="max-w-2xl mx-auto">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h1 className="card-title text-3xl mb-6">Upload Video</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-control">
                                <label className="label" htmlFor="video-file">
                                    <span className="label-text text-lg">Select Video File</span>
                                </label>
                                <input
                                    type="file"
                                    id="video-file"
                                    accept="video/*"
                                    onChange={handleFileSelect}
                                    disabled={uploading}
                                    className="file-input file-input-bordered file-input-primary w-full"
                                />
                                {selectedFile && (
                                    <div className="alert alert-info mt-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="title">
                                    <span className="label-text text-lg">Title</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={uploading}
                                    required
                                    className="input input-bordered input-primary w-full"
                                    placeholder="Enter video title..."
                                />
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="description">
                                    <span className="label-text text-lg">Description</span>
                                    <span className="label-text-alt">Optional</span>
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={uploading}
                                    rows="4"
                                    className="textarea textarea-bordered textarea-primary w-full"
                                    placeholder="Enter video description..."
                                />
                            </div>

                            {uploading && (
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h3 className="card-title text-lg">Uploading...</h3>
                                        <div className="w-full bg-base-300 rounded-full h-4">
                                            <div 
                                                className="bg-primary h-4 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-center text-lg font-semibold">{uploadProgress}% uploaded</p>
                                    </div>
                                </div>
                            )}

                            <div className="form-control mt-8">
                                <button 
                                    type="submit" 
                                    disabled={uploading || !selectedFile || !title.trim()}
                                    className={`btn btn-primary btn-lg w-full ${uploading ? 'loading' : ''}`}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Video'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;