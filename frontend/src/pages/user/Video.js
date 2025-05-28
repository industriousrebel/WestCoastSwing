import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download, Palette, Minus, Plus, Upload, AlertCircle, Edit2, Trash2, MessageSquare } from 'lucide-react';
import Navbar from '../../components/header/navbar';
const ReviewedVideo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Video state
  const [videoSrc, setVideoSrc] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [error, setError] = useState(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [drawColor, setDrawColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(3);
  const [showDrawingMode, setShowDrawingMode] = useState(false);
  const [drawings, setDrawings] = useState([]); // Array of drawing objects with timestamps
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentRangeStart, setCommentRangeStart] = useState(null);
  const [commentRangeEnd, setCommentRangeEnd] = useState(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Video time sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const newTime = video.currentTime;
      setCurrentTime(newTime);
      
      // Show drawings for current timestamp (within 0.5 second window)
      redrawAnnotationsForTime(newTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [drawings]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play();
      setShowDrawingMode(false);
    } else {
      video.pause();
      setShowDrawingMode(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Math.abs(video.currentTime - currentTime) > 0.1) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video && video.videoWidth && video.videoHeight) {
      const containerWidth = video.offsetWidth;
      const containerHeight = video.offsetHeight;
      
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      canvas.style.width = containerWidth + 'px';
      canvas.style.height = containerHeight + 'px';
      
      redrawAnnotationsForTime(currentTime);
    }
  };

  const handleVideoLoad = () => {
    const video = videoRef.current;
    setVideoLoaded(true);
    setVideoDuration(video.duration || 0);
    setTimeout(resizeCanvas, 100);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setDrawings([]);
      setComments([]);
      setShowDrawingMode(false);
      setIsPlaying(false);
      setError(null);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Drawing functions
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleCanvasMouseDown = (e) => {
    if (!showDrawingMode) return;
    
    const coords = getCanvasCoordinates(e);
    setIsDrawing(true);
    setCurrentPath([{ ...coords, color: drawColor, size: brushSize }]);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || !showDrawingMode) return;
    
    const coords = getCanvasCoordinates(e);
    const newPoint = { ...coords, color: drawColor, size: brushSize };
    
    setCurrentPath(prev => {
      const newPath = [...prev, newPoint];
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (prev.length > 0) {
        const lastPoint = prev[prev.length - 1];
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      }
      
      return newPath;
    });
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (currentPath.length > 0) {
      const newDrawing = {
        id: Date.now(),
        timestamp: currentTime,
        path: [...currentPath]
      };
      setDrawings(prev => [...prev, newDrawing]);
    }
    setCurrentPath([]);
  };

  const redrawAnnotationsForTime = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Show drawings within 0.5 second window of current time
    const relevantDrawings = drawings.filter(drawing => 
      Math.abs(drawing.timestamp - time) < 0.5
    );
    
    relevantDrawings.forEach(drawing => {
      if (drawing.path.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let i = 1; i < drawing.path.length; i++) {
          const prevPoint = drawing.path[i - 1];
          const currentPoint = drawing.path[i];
          
          ctx.strokeStyle = prevPoint.color || drawColor;
          ctx.lineWidth = prevPoint.size || brushSize;
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(currentPoint.x, currentPoint.y);
          ctx.stroke();
        }
      }
    });
  };

  const clearDrawingsAtCurrentTime = () => {
    setDrawings(prev => prev.filter(drawing => 
      Math.abs(drawing.timestamp - currentTime) >= 0.5
    ));
  };

  const seekTo = (time) => {
    setCurrentTime(time);
  };

  // Comment functions
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
      setComments(prev => [...prev, {
        id: Date.now(),
        start: commentRangeStart,
        end: commentRangeEnd,
        text: commentText
      }]);
      setCommentText('');
      setCommentRangeStart(null);
      setCommentRangeEnd(null);
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };

  const saveEditedComment = () => {
    setComments(prev => prev.map(comment =>
      comment.id === editingCommentId
        ? { ...comment, text: editingCommentText }
        : comment
    ));
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const deleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const downloadCoachingSession = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      // Create a summary document
      const sessionData = {
        timestamp: new Date().toISOString(),
        videoDuration: videoDuration,
        totalComments: comments.length,
        totalDrawings: drawings.length,
        comments: comments,
        drawings: drawings.map(d => ({
          id: d.id,
          timestamp: d.timestamp,
          pathLength: d.path.length
        }))
      };
      
      const dataStr = JSON.stringify(sessionData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coaching-session-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading session:', error);
      alert('Error saving session. Please try again.');
    }
  };

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 min-h-screen">
    <Navbar/>
      <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🏆 Video Coaching Platform
          </h1>
          
          {error && (
            <div className="flex items-center gap-2 p-4 text-red-800 bg-red-100 rounded-lg border border-red-200 mb-4">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
          
          {/* File Upload */}
          {!videoSrc && (
            <div className="mb-6 p-8 border-2 border-dashed border-gray-600 rounded-lg text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors mx-auto"
              >
                <Upload size={20} />
                <span>Upload Video to Coach</span>
              </button>
              <p className="text-gray-400 mt-2">Select a video file to start coaching session</p>
            </div>
          )}
          
          {/* Video Container */}
          {videoSrc && (
            <div className="relative mb-6 bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-96 object-contain"
                src={videoSrc}
                onLoadedMetadata={handleVideoLoad}
                onLoadedData={handleVideoLoad}
                onError={() => setError('Failed to load video')}
                crossOrigin="anonymous"
              />
              
              {/* Drawing Canvas Overlay */}
              <canvas
                ref={canvasRef}
                className={`absolute top-0 left-0 ${
                  showDrawingMode ? 'cursor-crosshair' : 'pointer-events-none'
                }`}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                style={{ touchAction: 'none' }}
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gray-900/80 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={togglePlayPause}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                    >
                      {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
                    </button>
                    <div className="text-white text-sm">
                      {Math.floor(currentTime)}s / {Math.floor(videoDuration)}s
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <div className="w-full bg-gray-700 rounded-full h-2 relative">
                    <div 
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                    />
                    
                    {/* Comment range selection */}
                    {commentRangeStart !== null && (
                      <div 
                        className="absolute top-0 h-2 bg-blue-400 rounded-full"
                        style={{ 
                          left: `${(commentRangeStart / videoDuration) * 100}%`,
                          width: `${((commentRangeEnd || currentTime) - commentRangeStart) / videoDuration * 100}%`
                        }}
                      />
                    )}
                    
                    {/* Comment markers */}
                    {comments.map(comment => (
                      <div 
                        key={comment.id}
                        className="absolute top-[-2px] h-6 bg-green-400 opacity-70 rounded-sm cursor-pointer hover:opacity-100"
                        style={{ 
                          left: `${(comment.start / videoDuration) * 100}%`,
                          width: `${Math.max(2, (comment.end - comment.start) / videoDuration * 100)}%`
                        }}
                        onClick={() => seekTo(comment.start)}
                        title={comment.text}
                      />
                    ))}
                    
                    {/* Drawing markers */}
                    {drawings.map(drawing => (
                      <div 
                        key={drawing.id}
                        className="absolute top-[-1px] w-2 h-4 bg-red-500 opacity-70 rounded-sm cursor-pointer hover:opacity-100"
                        style={{ left: `${(drawing.timestamp / videoDuration) * 100}%` }}
                        onClick={() => seekTo(drawing.timestamp)}
                        title={`Drawing at ${Math.floor(drawing.timestamp)}s`}
                      />
                    ))}
                    
                    {/* Timeline click area */}
                    <div 
                      className="absolute top-[-10px] w-full h-8 cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        seekTo(pos * videoDuration);
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Drawing Mode Indicator */}
              {showDrawingMode && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  🎨 Drawing Mode - Click and drag to annotate
                </div>
              )}
            </div>
          )}
          
          {/* Coaching Tools */}
          {videoSrc && videoLoaded && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Drawing Tools */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit2 size={20} />
                  Drawing Tools
                </h3>
                
                {showDrawingMode && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {/* Color Palette */}
                      <div className="flex items-center space-x-2">
                        <Palette size={20} className="text-white" />
                        <div className="flex space-x-1">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => setDrawColor(color)}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                drawColor === color ? 'border-white scale-110' : 'border-gray-500'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Brush Size */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
                          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-white px-3 py-1 bg-gray-600 rounded min-w-12 text-center">
                          {brushSize}px
                        </span>
                        <button
                          onClick={() => setBrushSize(Math.min(20, brushSize + 1))}
                          className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={clearDrawingsAtCurrentTime}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Clear Drawings at Current Time</span>
                    </button>
                  </div>
                )}
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300 text-sm">
                    {showDrawingMode 
                      ? "Click and drag on the video to draw annotations. Drawings are saved with timestamps."
                      : "Pause the video to activate drawing mode."
                    }
                  </p>
                  <p className="text-blue-300 text-sm mt-2">
                    📍 Drawings: {drawings.length} | Red markers show drawing timestamps
                  </p>
                </div>
              </div>
              
              {/* Comment Tools */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare size={20} />
                  Comment Tools
                </h3>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <button 
                      onClick={isSelectingRange ? endSelectingRange : startSelectingRange}
                      className={`px-3 py-2 rounded text-white transition-colors ${
                        isSelectingRange ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {isSelectingRange ? 'End Selection' : 'Select Time Range'}
                    </button>
                    
                    {commentRangeStart !== null && (
                      <div className="text-sm text-gray-300">
                        {Math.floor(commentRangeStart)}s - {Math.floor(commentRangeEnd || currentTime)}s
                      </div>
                    )}
                  </div>
                  
                  {commentRangeStart !== null && commentRangeEnd !== null && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add coaching feedback..."
                        className="flex-1 px-3 py-2 border rounded bg-gray-600 text-white placeholder-gray-400"
                      />
                      <button 
                        onClick={addComment}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                      >
                        Add Comment
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Comments List */}
                {comments.length > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <h4 className="text-white font-medium mb-2">Comments ({comments.length})</h4>
                    <div className="space-y-2">
                      {comments.map(comment => (
                        <div key={comment.id} className="bg-gray-600 p-3 rounded">
                          <div className="flex justify-between items-start gap-2">
                            <span 
                              className="text-sm text-blue-300 cursor-pointer hover:underline" 
                              onClick={() => seekTo(comment.start)}
                            >
                              {Math.floor(comment.start)}s - {Math.floor(comment.end)}s
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEditingComment(comment)}
                                className="p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => deleteComment(comment.id)}
                                className="p-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          
                          {editingCommentId === comment.id ? (
                            <div className="mt-2 flex gap-2">
                              <input
                                type="text"
                                value={editingCommentText}
                                onChange={e => setEditingCommentText(e.target.value)}
                                className="flex-1 px-2 py-1 bg-gray-500 text-white rounded"
                              />
                              <button
                                onClick={saveEditedComment}
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-200 mt-1">{comment.text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Session Actions */}
          {videoSrc && videoLoaded && (comments.length > 0 || drawings.length > 0) && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <h4 className="font-medium">Coaching Session Summary</h4>
                  <p className="text-sm text-gray-300">
                    {comments.length} comments • {drawings.length} drawings
                  </p>
                </div>
                <button
                  onClick={downloadCoachingSession}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Download size={20} />
                  <span>Save Coaching Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewedVideo;