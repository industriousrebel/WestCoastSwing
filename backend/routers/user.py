from fastapi import FastAPI, File, UploadFile, APIRouter
from fastapi.responses import JSONResponse, FileResponse
from fastapi import Request
from utils.auth0 import require_auth
from fastapi import Depends
router = APIRouter(prefix="/users", tags=["users"])
user_id = 1

@router.get("/your_coaches",  dependencies=[Depends(require_auth)])
def list_user_coaches(request: Request):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:]  # Remove "Bearer " prefix
    else:
        print("No Bearer token found")
    return [
        {"id": 1, "name": "Alice", "reviewed_all": True}, 
        {"id": 2, "name": "Bob", "reviewed_all": False}
    ]

@router.get("/coach_reviewed_status", summary="List all coaches for current user")
def list_coach_videos_reviewed():
    return [
        {"coach_id": 1, "reviewed_all": True},
        {"coach_id": 2, "reviewed_all": False}
    ]

@router.get("/avalible_coaches", summary="List all coaches for current user")
def list_new_coaches():
    #Coaches that are not already assigned to the user
    return [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]


@router.post('/upload?coach_id={coach_id}', summary="Upload a video file for a coach")
def upload_file(coach_id: int, file: UploadFile = File(...)):
    contents = file.read()
    with open(f'./videos/uploaded_{file.filename}', 'wb') as f:
        f.write(contents)
    return JSONResponse(content={"filename": file.filename, "coach_id": coach_id})

@router.get("/videos", summary="List all videos for a coach")
def list_videos(coach_id: int, user_id: int):
    # Return list of videos for the specified coach and user
    return [
        {"id": 1, "filename": "video1.mp4", "coach_id": coach_id, "user_id": user_id},
        {"id": 2, "filename": "video2.mp4", "coach_id": coach_id, "user_id": user_id}
    ]

@router.get("/video/{video_id}", summary="Get a video file")
def get_video(video_id: int, coach_id: int, user_id: int):
    # Return the video file for the specified video, coach, and user
    return FileResponse(f"./videos/video_{video_id}.mp4", media_type="video/mp4")

@router.delete("/video/{video_id}", summary="Delete a video file")
def delete_video(video_id: int, coach_id: int, user_id: int):
    # Delete the video file for the specified video, coach, and user
    return JSONResponse(content={"message": f"Video {video_id} deleted for coach {coach_id} and user {user_id}"})

@router.get("/video/{video_id}/metadata", summary="Get video metadata")
def get_video_metadata(video_id: int, coach_id: int, user_id: int):
    # Return metadata for the specified video, coach, and user
    return {
        "video_id": video_id,
        "coach_id": coach_id,
        "user_id": user_id,
        "filename": f"video_{video_id}.mp4",
        "duration": 120,
        "size": 1024000,
        "upload_date": "2023-01-01T00:00:00Z",
        "comments": [
            {
                "comment_id": 1,
                "comment": "Good frame and posture here",
                "start_timestamp": 15.0,
                "end_timestamp": 17.0,
            },
            {
                "comment_id": 2,
                "comment": "Work on extending your frame more",
                "start_timestamp": 32.0,
                "end_timestamp": 35.0,
            },
            {
                "comment_id": 3,
                "comment": "Nice connection with partner",
                "start_timestamp": 66.5,
                "end_timestamp": 68.0,
            }
        ],
        "annotations": [
            {
                "annotation_id": 1,
                "type": "highlight",
                "timestamp": 15.0,
                "description": "Key moment in routine"
            },
            {
                "annotation_id": 2,
                "type": "marker",
                "timestamp": 45.0,
                "description": "Timing reference point"
            },
            {
                "annotation_id": 3,
                "type": "region",
                "timestamp": 81.5,
                "description": "Focus area for improvement"
            }
        ]
    }
