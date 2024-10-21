from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse,FileResponse

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
    return FileResponse("./videos/uploaded_IMG_0975.MOV")


@app.get('/videoanalysis')
async def video_analysis():

    return JSONResponse([])