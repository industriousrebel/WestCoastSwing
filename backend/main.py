from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse,FileResponse
import uvicorn

app = FastAPI()


@app.get("/")
async def main_route():     
  return {"message": "Hello World"}

@app.post('/upload')
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    with open(f'./videos/uploaded_{file.filename}', 'wb') as f:
        f.write(contents)
    return JSONResponse(content={"filename": file.filename})

@app.get("/video")
async def get_video():
    return FileResponse("./videos/movie.mp4", media_type="video/mp4")


@app.get('/videoanalysis')
async def video_analysis():

    return JSONResponse([])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)