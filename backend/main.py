from fastapi import FastAPI, File, UploadFile, APIRouter
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
from routers import coach, user

app = FastAPI()
router = APIRouter()
@router.get("/")
async def main_route():     
    return {"message": "Hello World"}

@router.post('/upload')
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    with open(f'./videos/uploaded_{file.filename}', 'wb') as f:
        f.write(contents)
    return JSONResponse(content={"filename": file.filename})

@router.get("/video")
async def get_video():
    return FileResponse("./videos/movie.mp4", media_type="video/mp4")

@router.get('/videoanalysis')
async def video_analysis():
    return JSONResponse([])

app.include_router(router)
app.include_router(coach.router, prefix="/coach")
app.include_router(user.router, prefix="/user")
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)