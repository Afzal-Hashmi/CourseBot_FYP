import os
import subprocess
import json
import shutil
import uuid
from fastapi import FastAPI, UploadFile, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Directories
os.makedirs("static/videos", exist_ok=True)
os.makedirs("static/transcripts", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


import warnings

warnings.filterwarnings("ignore", category=UserWarning)


# Models
class VideoUploadResponse(BaseModel):
    video_id: str
    video_path: str
    status: str


class TranscriptResponse(BaseModel):
    video_id: str
    transcript: List[dict]
    status: str


class QueryRequest(BaseModel):
    video_id: str
    question: str


class QueryResponse(BaseModel):
    answer: str
    timestamp: Optional[float]
    relevant_text: str
    video_path: str


def find_ffmpeg():
    ffmpeg_path = shutil.which("ffmpeg")
    if ffmpeg_path:
        return ffmpeg_path
    common_paths = [
        r"E:\ffmpeg\ffmpeg-2025-07-12-git-35a6de137a-essentials_build\bin\ffmpeg.exe",
        r"E:\ffmpeg\ffmpeg-2025-07-12-git-35a6de137a-essentials_build\bin\ffplay.exe",
        r"E:\ffmpeg\ffmpeg-2025-07-12-git-35a6de137a-essentials_build\bin\ffprobe.exe",
        os.path.join("static", "ffmpeg", "ffmpeg.exe"),
    ]
    for path in common_paths:
        if os.path.exists(path):
            return path
    return None


@app.post("/upload", response_model=VideoUploadResponse)
async def upload_video(file: UploadFile):
    try:
        video_id = str(uuid.uuid4())
        ext = os.path.splitext(file.filename)[1]
        filename = f"{video_id}{ext}"
        video_path = f"static/videos/{filename}"

        with open(video_path, "wb") as f:
            f.write(await file.read())

        return {
            "video_id": video_id,
            "video_path": f"/static/videos/{filename}",
            "status": "uploaded",
        }

    except Exception as e:
        print("❌ Upload error:", str(e))
        raise HTTPException(500, detail=str(e))


@app.post("/process-video/{video_id}", response_model=TranscriptResponse)
async def process_video(video_id: str):
    try:
        print(f"🚀 Processing video ID: {video_id}")

        video_files = [f for f in os.listdir("static/videos") if f.startswith(video_id)]
        if not video_files:
            raise HTTPException(404, detail="Video file not found")

        video_path = f"static/videos/{video_files[0]}"
        audio_path = f"static/audios/{video_id}.mp3"
        transcript_path = f"static/transcripts/{video_id}.json"

        ffmpeg = find_ffmpeg()
        if not ffmpeg:
            raise HTTPException(500, detail="FFmpeg not found")

        # Convert video to audio
        cmd = [
            ffmpeg,
            "-i",
            video_path,
            "-vn",
            "-acodec",
            "libmp3lame",
            "-ac",
            "1",
            "-ar",
            "16000",
            "-ab",
            "64k",
            audio_path,
        ]

        subprocess.run(cmd, check=True, capture_output=True, text=True)

        if not os.path.exists(audio_path):
            raise HTTPException(500, detail="Audio conversion failed")

        transcript = transcribe_with_whisper(audio_path)

        with open(transcript_path, "w") as f:
            json.dump(transcript, f, indent=2)

        return {"video_id": video_id, "transcript": transcript, "status": "success"}

    except subprocess.CalledProcessError as e:
        print("❌ FFmpeg error:", e.stderr)
        raise HTTPException(500, detail=e.stderr)
    except Exception as e:
        print("❌ General processing error:", str(e))
        raise HTTPException(500, detail=str(e))


def transcribe_with_whisper(audio_path: str) -> List[dict]:
    try:
        import warnings

        warnings.filterwarnings("ignore", category=UserWarning)

        import os

        os.environ["PATH"] += (
            os.pathsep
            + r"E:\ffmpeg\ffmpeg-2025-07-12-git-35a6de137a-essentials_build\bin"
        )

        import whisper
        import torch

        if not os.path.exists(audio_path):
            raise FileNotFoundError("Audio file not found")

        torch.set_num_threads(4)
        model = whisper.load_model("tiny.en", device="cpu")

        result = model.transcribe(audio_path)

        return [
            {
                "text": s["text"].strip(),
                "start": round(s["start"], 2),
                "end": round(s["end"], 2),
            }
            for s in result["segments"]
        ]

    except Exception as e:
        print("❌ Whisper transcription error:", str(e))
        raise


@app.post("/query-video", response_model=QueryResponse)
async def query_video(query: QueryRequest):
    try:
        transcript_path = f"static/transcripts/{query.video_id}.json"
        if not os.path.exists(transcript_path):
            raise HTTPException(404, detail="Transcript not found")

        with open(transcript_path, "r") as f:
            transcript = json.load(f)

        video_file = next(
            (f for f in os.listdir("static/videos") if f.startswith(query.video_id)),
            None,
        )
        if not video_file:
            raise HTTPException(404, detail="Video not found")

        video_path = f"/static/videos/{video_file}"

        results = [s for s in transcript if query.question.lower() in s["text"].lower()]
        if not results:
            return QueryResponse(
                answer="No match found",
                timestamp=None,
                relevant_text="",
                video_path=video_path,
            )

        seg = results[0]
        return QueryResponse(
            answer=seg["text"],
            timestamp=seg["start"],
            relevant_text=seg["text"],
            video_path=f"{video_path}#t={int(seg['start'])}",
        )

    except Exception as e:
        print("❌ Query error:", str(e))
        raise HTTPException(500, detail=str(e))


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
