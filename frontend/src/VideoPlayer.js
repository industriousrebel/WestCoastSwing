
import React, { useRef, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Play, Pause } from 'lucide-react';

const steps = [
    { timestamp: 1, data: { beat_type: "Upbeat", foot: "Left Foot", articulation_angle: 12, end_time_of_step: 2, type_of_step: "type_of_step", ontime: true } },
    { timestamp: 2, data: { beat_type: "Downbeat", foot: "Right Foot", articulation_angle: 15, end_time_of_step: 3, type_of_step: "type_of_step", ontime: false } },
    { timestamp: 3, data: { beat_type: "Upbeat", foot: "Left Foot", articulation_angle: 18, end_time_of_step: 4, type_of_step: "", ontime: true } },
    { timestamp: 4, data: { beat_type: "", foot: "Right Foot", articulation_angle: 20, end_time_of_step: 5, type_of_step: "type_of_step", ontime: false } },
    { timestamp: 5, data: { beat_type: "Downbeat", foot: "", articulation_angle: 22, end_time_of_step: 6, type_of_step: "type_of_step", ontime: true } },
    { timestamp: 6, data: { beat_type: "Upbeat", foot: "Left Foot", articulation_angle: 25, end_time_of_step: 7, type_of_step: "type_of_step", ontime: true } },
    { timestamp: 7, data: { beat_type: "Downbeat", foot: "Right Foot", articulation_angle: "", end_time_of_step: 8, type_of_step: "type_of_step", ontime: false } },
    { timestamp: 8, data: { beat_type: "Upbeat", foot: "Left Foot", articulation_angle: 30, end_time_of_step: 9, type_of_step: "", ontime: true } },
    { timestamp: 9, data: { beat_type: "Downbeat", foot: "", articulation_angle: 35, end_time_of_step: 10, type_of_step: "type_of_step", ontime: false } },
    { timestamp: 10, data: { beat_type: "Upbeat", foot: "Left Foot", articulation_angle: 40, end_time_of_step: 11, type_of_step: "type_of_step", ontime: true } },
    { timestamp: 11, data: { beat_type: "Downbeat", foot: "Right Foot", articulation_angle: 42, end_time_of_step: 12, type_of_step: "type_of_step", ontime: true } },
    { timestamp: 12, data: { beat_type: "", foot: "Left Foot", articulation_angle: 45, end_time_of_step: 13, type_of_step: "type_of_step", ontime: false } },
    { timestamp: 13, data: { beat_type: "Upbeat", foot: "", articulation_angle: 48, end_time_of_step: 14, type_of_step: "type_of_step", ontime: true } },
    { timestamp: 14, data: { beat_type: "Downbeat", foot: "Right Foot", articulation_angle: "", end_time_of_step: 15, type_of_step: "type_of_step", ontime: false } },
    { timestamp: 15, data: { beat_type: "Upbeat", foot: "Left Foot", articulation_angle: 52, end_time_of_step: 16, type_of_step: "type_of_step", ontime: true } },
    { timestamp: 16, data: { beat_type: "Downbeat", foot: "Right Foot", articulation_angle: 55, end_time_of_step: 17, type_of_step: "", ontime: false } },
    { timestamp: 17, data: { beat_type: "Upbeat", foot: "", articulation_angle: 58, end_time_of_step: 18, type_of_step: "type_of_step", ontime: true } }
];


const VideoPlayer = () => {
    const videoRef = useRef(null);
    const [info, setInfo] = useState({});
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // Simulated playback for demo purposes
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(time => {
                    const newTime = time + 1;
                    if (newTime >= 17) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    // Update info based on current time
    useEffect(() => {
        const step = steps.find(s => s.timestamp === currentTime);
        if (step) {
            setInfo(step.data);
        }
    }, [currentTime]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const formatValue = (value) => {
        if (value === "" || value === undefined) return "N/A";
        return value;
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
                <img 
                    src="http://localhost:8001/video" 
                    alt="Video placeholder"
                    className="w-full h-full object-cover"
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
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                            <div 
                                className="bg-white h-1 rounded-full transition-all"
                                style={{ width: `${(currentTime / 17) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {Object.keys(info).length > 0 && (
                <div className={`rounded-lg p-4 ${info.ontime ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'} border`}>
                    <div className="flex items-center gap-2 mb-4">
                        {info.ontime ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <h3 className="font-semibold text-lg">
                            {info.ontime ? 'On Time' : 'Off Time'}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(info).map(([key, value]) => (
                            key !== 'ontime' && (
                                <div key={key} className="bg-white rounded-lg p-3 shadow-sm">
                                    <div className="text-sm text-gray-600 capitalize">
                                        {key.split('_').join(' ')}
                                    </div>
                                    <div className="font-semibold mt-1">
                                        {formatValue(value)}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;