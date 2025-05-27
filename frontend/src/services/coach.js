const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const BASE_URL = `${API_BASE_URL}/coach`;

export async function searchStudents(search = '') {
    const response = await fetch(`${BASE_URL}/student_search?search=${encodeURIComponent(search)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

export async function listStudents() {
    const response = await fetch(`${BASE_URL}/student_list`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

export async function listStudentVideos(studentId) {
    const response = await fetch(`${BASE_URL}/student_video_list?student_id=${studentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

export async function getStudentVideo(studentId, videoId) {
    const response = await fetch(`${BASE_URL}/student_video?student_id=${studentId}&video_id=${videoId}`, {
        method: 'GET',
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.blob();
}

export async function createComment(studentId, videoId, timestampStart, timestampEnd, comment) {
    const response = await fetch(`${BASE_URL}/comments/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: studentId,
            video_id: videoId,
            timestamp_start: timestampStart,
            timestamp_end: timestampEnd,
            comment: comment,
        }),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

export async function getComments(studentId, videoId) {
    const response = await fetch(`${BASE_URL}/comments?student_id=${studentId}&video_id=${videoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

export async function deleteComment(studentId, videoId, timestampStart, timestampEnd, comment) {
    const response = await fetch(`${BASE_URL}/comments/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: studentId,
            video_id: videoId,
            timestamp_start: timestampStart,
            timestamp_end: timestampEnd,
            comment: comment,
        }),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

export async function createAnnotation(studentId, videoId, timestampStart, timestampEnd, annotation) {
    const response = await fetch(`${BASE_URL}/annotations/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: studentId,
            video_id: videoId,
            timestamp_start: timestampStart,
            timestamp_end: timestampEnd,
            annotation: annotation,
        }),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

export async function getAnnotations(studentId, videoId) {
    const response = await fetch(`${BASE_URL}/annotations?student_id=${studentId}&video_id=${videoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

export async function deleteAnnotation(studentId, videoId, timestampStart, timestampEnd, annotation) {
    const response = await fetch(`${BASE_URL}/annotations/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: studentId,
            video_id: videoId,
            timestamp_start: timestampStart,
            timestamp_end: timestampEnd,
            annotation: annotation,
        }),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}
