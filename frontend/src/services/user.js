const API_BASE_URL =  'http://localhost:8001';
const auth0_token = localStorage.getItem('token');

export const getUserSignupStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/signup_status`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${auth0_token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch coaches');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user coaches:', error);
        throw error;
    }
}
// Get all coaches for current user
export const getUserCoaches = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/your_coaches`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${auth0_token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch coaches');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user coaches:', error);
        throw error;
    }
};

// Get coach review status
export const getCoachReviewedStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/coach_reviewed_status`, {
            headers: {
                'Authorization': `Bearer ${auth0_token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch coach review status');
        return await response.json();
    } catch (error) {
        console.error('Error fetching coach review status:', error);
        throw error;
    }
};

// Get available coaches (not assigned to user)
export const getAvailableCoaches = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/avalible_coaches`, {
            headers: {
                'Authorization': `Bearer ${auth0_token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch available coaches');
        return await response.json();
    } catch (error) {
        console.error('Error fetching available coaches:', error);
        throw error;
    }
};

// Upload video file for a coach
export const uploadVideo = async (coachId, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/users/upload?coach_id=${coachId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth0_token}`
            },
            body: formData,
        });
        
        if (!response.ok) throw new Error('Failed to upload video');
        return await response.json();
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};

// Get videos for a coach
export const getVideos = async (coachId, userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/videos?coach_id=${coachId}&user_id=${userId}`, {
            headers: {
                'Authorization': `Bearer ${auth0_token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch videos');
        return await response.json();
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
    }
};

// Get video file URL
export const getVideoUrl = (videoId, coachId, userId) => {
    return `${API_BASE_URL}/users/video/${videoId}?coach_id=${coachId}&user_id=${userId}&token=${auth0_token}`;
};

// Delete video
export const deleteVideo = async (videoId, coachId, userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/video/${videoId}?coach_id=${coachId}&user_id=${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${auth0_token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete video');
        return await response.json();
    } catch (error) {
        console.error('Error deleting video:', error);
        throw error;
    }
};

// Get video metadata with comments and annotations
export const getVideoMetadata = async (videoId, coachId, userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/video/${videoId}/metadata?coach_id=${coachId}&user_id=${userId}`, {
            headers: {
                'Authorization': `Bearer ${auth0_token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch video metadata');
        return await response.json();
    } catch (error) {
        console.error('Error fetching video metadata:', error);
        throw error;
    }
};