from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse, FileResponse
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List
from functools import wraps
from ..database import get_db
from .. import models


router = APIRouter(tags=["coach"])
# security = HTTPBearer()
# def get_coach_id(token: str = Depends(security), db: Session = Depends(get_db)):
def get_coach_id():
    """
    Placeholder function to get coach ID from session/token
    This will handle authentication and return the coach ID
    """
    # TODO: Implement actual token validation and coach ID extraction
    # For now, returning a placeholder coach ID
    coach_id = 1  # Placeholder
    
    # TODO: Add actual authentication logic here
    # - Validate token
    # - Extract user info from token
    # - Verify user is a coach
    # - Return coach ID or raise HTTPException if unauthorized
    
    return coach_id

@router.get("/student_search")
def search_students(search: str = "", coach_id: int = Depends(get_coach_id)):
    return [
        {"user_id": 1, "name": "John Doe", "email": "john@example"},
        {"user_id": 2, "name": "Jane Smith", "email": "jane@example"},
    ]

@router.get("/student_list")
def list_students(coach_id: int = Depends(get_coach_id)):
    return [
        {"user_id": 1, "name": "John Doe", "email": "john@example"},
        {"user_id": 2, "name": "Jane Smith", "email": "jane@example"},
    ]

@router.get("/student_video_list")
def list_student_videos(student_id: int, coach_id: int = Depends(get_coach_id)):
    return [
        {"video_id": 1, "video_status": "Completed"},
        {"video_id": 2, "video_status": "pending"},
    ]
@router.get("/student_video")
def student_video(student_id: int, video_id: int, coach_id: int = Depends(get_coach_id)):
    return FileResponse("./videos/movie.mp4", media_type="video/mp4")


@router.post("/comments/create")
def create_comment(coach_id: int = Depends(get_coach_id), student_id: str = "", video_id: str = "", timestamp_start: str = "", timestamp_end: str = "", comment: str = ""):
    return {
            "Success": True
            }

@router.get("/comments")
def get_comments(student_id: str, video_id: str, coach_id: int = Depends(get_coach_id)):
    return [
        {"comment_id": 1, "timestamp_start": "00:30", "timestamp_end": "00:45", "comment": "Great posture here"},
        {"comment_id": 2, "timestamp_start": "01:15", "timestamp_end": "01:20", "comment": "Work on frame"}
    ]

@router.delete("/comments/delete")
def delete_comment(coach_id: int = Depends(get_coach_id), student_id: str = "", video_id: str = "", timestamp_start: str = "", timestamp_end: str = "", comment: str = ""):
    return {
            "Success": True
            }

@router.post("/annotations/create")
def create_annotation(coach_id: int = Depends(get_coach_id), student_id: str = "", video_id: str = "", timestamp_start: str = "", timestamp_end: str = "", annotation: str = ""):
    return {
            "Success": True
            }

@router.get("/annotations")
def get_annotations(student_id: str, video_id: str, coach_id: int = Depends(get_coach_id)):
    return [
        {"annotation_id": 1, "timestamp": "00:15", "points": [{"x": 100, "y": 150}, {"x": 120, "y": 170}, {"x": 140, "y": 190}]},
        {"annotation_id": 2, "timestamp": "01:30", "points": [{"x": 250, "y": 300}, {"x": 270, "y": 320}]}
    ]

@router.delete("/annotations/delete")
def delete_annotation(coach_id: int = Depends(get_coach_id), student_id: str = "", video_id: str = "", timestamp_start: str = "", timestamp_end: str = "", annotation: str = ""):
    return {
            "Success": True
            }