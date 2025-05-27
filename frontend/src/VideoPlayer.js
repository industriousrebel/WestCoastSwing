
import React, { useRef, useEffect, useState } from 'react';
import { AlertCircle, Play, Pause } from 'lucide-react';



const VideoPlayer = () => {
    const videoRef = useRef(null);
    // Removed unused 'info' state
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    // Play/pause the actual video element
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.play();
        } else {
            video.pause();
        }
    }, [isPlaying]);

    // Sync currentTime state with video element
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    // Seek video when currentTime changes (from timeline or comment click)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (Math.abs(video.currentTime - currentTime) > 0.1) {
            video.currentTime = currentTime;
        }
    }, [currentTime]);



    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const [commentRangeStart, setCommentRangeStart] = useState(null);
    const [commentRangeEnd, setCommentRangeEnd] = useState(null);
    const [isSelectingRange, setIsSelectingRange] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [videoDuration, setVideoDuration] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setVideoDuration(video.duration || 0);
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        // If metadata is already loaded (e.g., fast reload), set duration immediately
        if (video.readyState >= 1 && video.duration) {
            setVideoDuration(video.duration);
        }
        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);

    const startSelectingRange = () => {
        setIsSelectingRange(true);
        setCommentRangeStart(currentTime);
        setCommentRangeEnd(null);
    };

    const endSelectingRange = () => {
        setIsSelectingRange(false);
        setCommentRangeEnd(currentTime);
    };

    const addComment = () => {
        if (commentText.trim() && commentRangeStart !== null && commentRangeEnd !== null) {
            setComments([
                ...comments,
                {
                    id: Date.now(),
                    start: commentRangeStart,
                    end: commentRangeEnd,
                    text: commentText
                }
            ]);
            setCommentText('');
            setCommentRangeStart(null);
            setCommentRangeEnd(null);
        }
    };

    const seekTo = (time) => {
        setCurrentTime(time);
    };

    // State for editing comments
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    // Start editing a comment
    const startEditingComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.text);
    };

    // Save edited comment
    const saveEditedComment = () => {
        setComments(comments.map(comment =>
            comment.id === editingCommentId
                ? { ...comment, text: editingCommentText }
                : comment
        ));
        setEditingCommentId(null);
        setEditingCommentText('');
    };

    // Cancel editing
    const cancelEditingComment = () => {
        setEditingCommentId(null);
        setEditingCommentText('');
    };

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto gap-4 p-4">
            {error && (
                <div className="flex items-center gap-2 p-4 text-red-800 bg-red-100 rounded-lg border border-red-200">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="rounded-lg bg-gray-800 aspect-video relative overflow-hidden">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src="http://localhost:8001/video"
                    onLoadedMetadata={() => {/* No-op: removed setInfo */}}
                    onError={() => setError('Failed to load video')}
                />
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gray-900/80 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handlePlayPause}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                            >
                                {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
                            </button>
                            <div className="text-white">
                                Time: {currentTime}s
                            </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-1 relative">
                            <div 
                                className="bg-white h-1 rounded-full transition-all"
                                style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                            />
                            
                            {/* Show selected range if any */}
                            {commentRangeStart !== null && (
                                <div 
                                    className="absolute top-0 h-1 bg-blue-400 rounded-full"
                                    style={{ 
                                        left: `${(commentRangeStart / videoDuration) * 100}%`,
                                        width: `${((commentRangeEnd || currentTime) - commentRangeStart) / videoDuration * 100}%`
                                    }}
                                />
                            )}
                            
                            {/* Markers for existing comments */}
                            {comments.map(comment => (
                                <div 
                                    key={comment.id}
                                    className="absolute top-[-4px] h-3 bg-green-400 opacity-70 rounded-sm"
                                    style={{ 
                                        left: `${(comment.start / videoDuration) * 100}%`,
                                        width: `${(comment.end - comment.start) / videoDuration * 100}%`
                                    }}
                                    onClick={() => seekTo(comment.start)}
                                />
                            ))}
                            
                            {/* Timeline click area */}
                            <div 
                                className="absolute top-[-10px] w-full h-6 cursor-pointer"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const pos = (e.clientX - rect.left) / rect.width;
                                    seekTo(Math.floor(pos * videoDuration));
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Comment controls */}
            <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                    <button 
                        onClick={isSelectingRange ? endSelectingRange : startSelectingRange}
                        className={`px-3 py-1 rounded ${isSelectingRange ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                    >
                        {isSelectingRange ? 'End selection' : 'Select time range'}
                    </button>
                    
                    {commentRangeStart !== null && (
                        <div className="text-sm text-gray-600">
                            {commentRangeStart}s - {commentRangeEnd || currentTime}s
                        </div>
                    )}
                </div>
                
                {commentRangeStart !== null && commentRangeEnd !== null && (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add your comment here..."
                            className="flex-1 px-3 py-2 border rounded"
                        />
                        <button 
                            onClick={addComment}
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Add Comment
                        </button>
                    </div>
                )}
            </div>

            {/* List of comments */}
            {comments.length > 0 && (
                <div className="bg-white rounded-lg p-4 border">
                    <h3 className="font-medium mb-2">Comments</h3>
                    <ul className="space-y-2">
                        {comments.map(comment => (
                            <li key={comment.id} className="border-b pb-2">
                                <div className="flex justify-between items-center gap-2">
                                    <span className="text-sm text-blue-600 cursor-pointer" onClick={() => seekTo(comment.start)}>
                                        {comment.start}s - {comment.end}s
                                    </span>
                                    {editingCommentId === comment.id ? (
                                        <div className="flex gap-2 flex-1">
                                            <input
                                                type="text"
                                                value={editingCommentText}
                                                onChange={e => setEditingCommentText(e.target.value)}
                                                className="flex-1 px-2 py-1 border rounded"
                                            />
                                            <button
                                                onClick={saveEditedComment}
                                                className="px-2 py-1 bg-green-500 text-white rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEditingComment}
                                                className="px-2 py-1 bg-gray-300 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-sm text-gray-500 flex-1">{comment.text}</span>
                                            <button
                                                onClick={() => startEditingComment(comment)}
                                                className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;