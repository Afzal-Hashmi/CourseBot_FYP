import datetime
import http
import io
import json
import os
import shutil
import subprocess
import uuid
import traceback
import http.client
from fastapi import Depends, HTTPException, status, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from ..schemas.teacherSchema import course_content_schema, course_schema
from ..config.connection import get_db
from ..repo.TeacherRepo import TeacherRepository


class TeacherService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.teacher_repo = TeacherRepository(db)

    async def fetch_courses_service(self, current_user: dict):
        try:
            response = await self.teacher_repo.fetch_courses_repo(current_user)
            return response
        except Exception as e:
            print(f"Error fetching courses: {e}")
            raise HTTPException("Error fetching courses")

    async def delete_course_service(self, course_id: int, current_user: dict):
        try:
            response = await self.teacher_repo.delete_course_repo(
                course_id, current_user
            )
            if response:
                response = await self.teacher_repo.fetch_courses_repo(current_user)
                return response
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Course Not Found"
            )
        except Exception as e:
            print(f"Error deleting course: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error deleting course students enrolled in the course",
            )

    async def create_course_service(self, form_Data: course_schema, current_user: dict):
        try:
            response = await self.teacher_repo.create_course_repo(
                form_Data, current_user
            )
            if response:
                response = await self.fetch_courses_service(current_user)
                return response
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Course Not Created",
            )
        except Exception as e:
            print(f"Error creating course: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating course",
            )

    async def edit_course_service(
        self, course_id: int, form_Data: dict, current_user: dict
    ):
        try:
            response = await self.teacher_repo.edit_course_repo(
                course_id, form_Data, current_user
            )
            if response:
                response = await self.fetch_courses_service(current_user)
                return response
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Course Not Found"
            )
        except Exception as e:
            print(f"Error editing course: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error editing course",
            )

    async def fetch_feedback_service(self, current_user: dict):
        try:
            response = await self.teacher_repo.fetch_feedback_repo(current_user)
            if not response:
                return []
            return response
        except Exception as e:
            print(f"Error fetching feedback: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching feedback",
            )

    # async def upload_content_service(
    #     self,
    #     form_data: course_content_schema,
    #     file: UploadFile,
    #     current_user: dict,
    #     url: str = None,
    # ):
    #     db_record = None
    #     EXTENSION_MAP = {
    #         "video": [".mp4", ".avi", ".mov", ".mkv"],
    #         "pdf": [".pdf"],
    #         "pptx": [".pptx"],
    #         "docx": [".doc", ".docx"],
    #     }
    #     try:
    #         file_content = await file.read()
    #         response = await self.teacher_repo.upload_content_repo(form_data, url)
    #         db_record = response
    #         print(db_record)
    #         ext = os.path.splitext(file.filename)[1].lower()
    #         course_id = response.get("course_id")
    #         content_id = response.get("content_id")
    #         vectera_document_id = (
    #             form_data.content_title + "-" + str(form_data.course_id)
    #         )
    #         if ext in EXTENSION_MAP["video"]:
    #             print("📹 Detected video content type, uploading video...")
    #             file.file = io.BytesIO(file_content)
    #             response = await self.upload_video(file)
    #             if not response:
    #                 raise HTTPException(status_code=500, detail="Video upload failed")
    #             processVideo = await self.process_video(response["video_id"], url)
    #             if not processVideo:
    #                 raise HTTPException(
    #                     status_code=500, detail="Video processing failed"
    #                 )
    #             print("✅ Video processed successfully:", processVideo)
    #             response["transcript"] = processVideo.get("transcript")
    #             response["status"] = "processed"
    #             response["video_path"] = response.get(
    #                 "video_path", f"/static/videos/{response['video_id']}.mp4"
    #             )
    #             response["video_id"] = response["video_id"]
    #             response["content_type"] = form_data.content_type
    #             response["content_title"] = form_data.content_title

    #             print("✅ Video uploaded successfully:", response)
    #             import http.client
    #             import json

    #             conn = http.client.HTTPSConnection("api.vectara.io")
    #             payload = json.dumps(
    #                 {
    #                     "type": "structured",
    #                     # "id": form_data.content_title + "-" + str(form_data.course_id),
    #                     "id": vectera_document_id,
    #                     "title": form_data.content_title,
    #                     "description": f"This Content is Uploaded for Course {form_data.course_id} the Content Title is {form_data.content_title} which is a {form_data.content_type}",
    #                     "metadata": {
    #                         "doc_type": "Trasncripts",
    #                         "status": "published",
    #                         "owner": f"{form_data.course_id}",
    #                         "title": form_data.content_title,
    #                         "type": form_data.content_type,
    #                         "filename": vectera_document_id,
    #                         "upload_date": datetime.datetime.now().isoformat(),
    #                         "course_id": course_id,
    #                         "content_id": content_id,
    #                     },
    #                     "sections": response.get("transcript"),
    #                 }
    #             )
    #             print(payload)
    #             headers = {
    #                 "Content-Type": "application/json",
    #                 "Accept": "application/json",
    #                 "x-api-key": os.getenv("VECTARA_API_KEY"),
    #             }
    #             # conn.request("POST", "/v2/corpora/Tester/documents", payload, headers)
    #             conn.request("POST", "/v2/corpora/umt/documents", payload, headers)

    #             res = conn.getresponse()
    #             data = res.read()

    #         else:
    #             print("here ////////////////////")
    #             file.file = io.BytesIO(file_content)
    #             file_content = await file.read()
    #             if not file_content:
    #                 print("dddddddddddddddddddddddddddddd")
    #                 raise HTTPException(status_code=400, detail="File is empty")

    #             boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
    #             print(boundary)

    #             metadata = {
    #                 "title": form_data.content_title,
    #                 "type": form_data.content_type,
    #                 "filename": vectera_document_id,
    #                 "upload_date": datetime.datetime.now().isoformat(),
    #                 "course_id": course_id,
    #                 "content_id": content_id,
    #             }
    #             print(metadata)
    #             metadata_json = json.dumps(metadata)

    #             body = b""

    #             body += (
    #                 f"--{boundary}\r\n"
    #                 f'Content-Disposition: form-data; name="metadata"\r\n'
    #                 f"Content-Type: application/json\r\n\r\n"
    #             ).encode("utf-8")

    #             print(body)
    #             body += metadata_json.encode("utf-8")
    #             body += b"\r\n"

    #             # Add file field
    #             body += (
    #                 f"--{boundary}\r\n"
    #                 f'Content-Disposition: form-data; name="file"; filename="{vectera_document_id}"\r\n'
    #                 f"Content-Type: {file.content_type}\r\n\r\n"
    #             ).encode("utf-8")
    #             body += file_content
    #             body += f"\r\n--{boundary}--\r\n".encode("utf-8")

    #             conn = http.client.HTTPSConnection("api.vectara.io")

    #             headers = {
    #                 "Content-Type": f"multipart/form-data; boundary={boundary}",
    #                 "Accept": "application/json",
    #                 "x-api-key": os.getenv("VECTARA_API_KEY"),
    #             }
    #             print(headers)

    #             # conn.request("POST", "/v2/corpora/Tester/upload_file", body, headers)
    #             conn.request("POST", "/v2/corpora/umt/upload_file", body, headers)

    #             res = conn.getresponse()
    #             data = res.read()
    #             print(res)

    #         print("////////////////////////")
    #         print(res.status)
    #         if res.status == 201:
    #             print("/////////////////////////////////")
    #             print(res)
    #             return {
    #                 "succeeded": True,
    #                 "message": "Content uploaded successfully",
    #                 "data": {
    #                     "filename": vectera_document_id,
    #                     "content_id": response.get("content_id"),
    #                     "course_id": response.get("course_id"),
    #                     "content_url": url,
    #                     "title": form_data.content_title,
    #                     "type": form_data.content_type,
    #                 },
    #                 "httpStatusCode": status.HTTP_201_CREATED,
    #             }
    #         else:
    #             if db_record and db_record.get("content_id"):
    #                 try:
    #                     await self.teacher_repo.delete_content_repo(
    #                         db_record.get("content_id")
    #                     )
    #                 except Exception as cleanup_error:
    #                     print(f"Failed to cleanup DB record: {cleanup_error}")
    #             raise HTTPException(
    #                 status_code=400,
    #                 detail=f"Vectara upload failed: {data.decode('utf-8')}",
    #             )
    #     except HTTPException:
    #         if db_record and db_record.get("content_id"):
    #             try:
    #                 await self.teacher_repo.delete_content_repo(
    #                     db_record.get("content_id")
    #                 )
    #             except Exception as cleanup_error:
    #                 print(f"Failed to cleanup DB record: {cleanup_error}")
    #         raise
    #     except Exception as e:
    #         if db_record and db_record.get("content_id"):
    #             try:
    #                 await self.teacher_repo.delete_content_repo(
    #                     db_record.get("content_id")
    #                 )
    #             except:
    #                 pass
    #         print(f"Upload error: {str(e)}")
    #         raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    async def upload_content_service(
        self,
        form_data: course_content_schema,
        file: UploadFile,
        current_user: dict,
        url: str = None,
    ):
        db_record = None
        EXTENSION_MAP = {
            "video": [".mp4", ".avi", ".mov", ".mkv"],
            "pdf": [".pdf"],
            "pptx": [".pptx"],
            "docx": [".doc", ".docx"],
        }

        try:
            file_content = await file.read()
            if not file_content:
                raise HTTPException(status_code=400, detail="File is empty")

            # Upload to DB
            response = await self.teacher_repo.upload_content_repo(form_data, url)
            db_record = response

            ext = os.path.splitext(file.filename)[1].lower()
            course_id = response.get("course_id")
            content_id = response.get("content_id")
            vectera_document_id = form_data.content_title + "-" + str(course_id)

            file.file = io.BytesIO(file_content)  # Assign once

            # Video Content Handling
            if ext in EXTENSION_MAP["video"]:
                print("📹 Detected video content type, uploading video...")
                video_response = await self.upload_video(file)
                if not video_response:
                    raise HTTPException(status_code=500, detail="Video upload failed")

                processed = await self.process_video(video_response["video_id"], url)
                if not processed:
                    raise HTTPException(
                        status_code=500, detail="Video processing failed"
                    )

                transcript = processed.get("transcript")

                # Upload to Vectara (Structured with transcript)
                vectara_payload = {
                    "type": "structured",
                    "id": vectera_document_id,
                    "title": form_data.content_title,
                    "description": f"This content is uploaded for Course {course_id}, titled {form_data.content_title}.",
                    "metadata": {
                        "doc_type": "Transcripts",
                        "status": "published",
                        "owner": str(course_id),
                        "title": form_data.content_title,
                        "type": form_data.content_type,
                        "filename": vectera_document_id,
                        "upload_date": datetime.datetime.now().isoformat(),
                        "course_id": course_id,
                        "content_id": content_id,
                    },
                    "sections": transcript,
                }

                headers = {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "x-api-key": os.getenv("VECTARA_API_KEY"),
                }

                conn = http.client.HTTPSConnection("api.vectara.io")
                conn.request(
                    "POST",
                    "/v2/corpora/umt/documents",
                    json.dumps(vectara_payload),
                    headers,
                )
                res = conn.getresponse()
                vectara_response = res.read()

            # Document or PDF Upload (Multipart)
            else:
                boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
                metadata = {
                    "title": form_data.content_title,
                    "type": form_data.content_type,
                    "filename": vectera_document_id,
                    "upload_date": datetime.datetime.now().isoformat(),
                    "course_id": course_id,
                    "content_id": content_id,
                }

                body = b""
                body += (
                    f"--{boundary}\r\n"
                    f'Content-Disposition: form-data; name="metadata"\r\n'
                    f"Content-Type: application/json\r\n\r\n"
                ).encode("utf-8")
                body += json.dumps(metadata).encode("utf-8")
                body += b"\r\n"

                body += (
                    f"--{boundary}\r\n"
                    f'Content-Disposition: form-data; name="file"; filename="{vectera_document_id}"\r\n'
                    f"Content-Type: {file.content_type}\r\n\r\n"
                ).encode("utf-8")
                body += file_content
                body += f"\r\n--{boundary}--\r\n".encode("utf-8")

                headers = {
                    "Content-Type": f"multipart/form-data; boundary={boundary}",
                    "Accept": "application/json",
                    "x-api-key": os.getenv("VECTARA_API_KEY"),
                }

                conn = http.client.HTTPSConnection("api.vectara.io")
                conn.request("POST", "/v2/corpora/umt/upload_file", body, headers)
                res = conn.getresponse()
                vectara_response = res.read()

            # ✅ Final check on Vectara response
            if res.status == 201:
                return {
                    "succeeded": True,
                    "message": "Content uploaded successfully",
                    "data": {
                        "filename": vectera_document_id,
                        "content_id": content_id,
                        "course_id": course_id,
                        "content_url": url,
                        "title": form_data.content_title,
                        "type": form_data.content_type,
                    },
                    "httpStatusCode": status.HTTP_201_CREATED,
                }
            else:
                print(
                    f"Vectara upload failed: status={res.status}, response={vectara_response.decode()}"
                )
                # Cleanup DB if Vectara fails
                if db_record and db_record.get("content_id"):
                    try:
                        await self.teacher_repo.delete_content_repo(content_id)
                    except Exception as cleanup_error:
                        print(f"⚠️ Failed to cleanup DB record: {cleanup_error}")

                raise HTTPException(
                    status_code=400,
                    detail=f"Vectara upload failed: {vectara_response.decode()}",
                )

        except HTTPException as e:
            if db_record and db_record.get("content_id"):
                try:
                    await self.teacher_repo.delete_content_repo(
                        db_record.get("content_id")
                    )
                except Exception as cleanup_error:
                    print(
                        f"⚠️ Failed to cleanup DB record (HTTPException): {cleanup_error}"
                    )
            raise

        except Exception as e:
            if db_record and db_record.get("content_id"):
                try:
                    await self.teacher_repo.delete_content_repo(
                        db_record.get("content_id")
                    )
                except:
                    pass
            print(f"❌ Upload error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    async def get_content_service(self, course_id: int):
        try:
            response = await self.teacher_repo.get_content_repo(course_id)
            if not response:
                return []
            return response
        except Exception as e:
            print(f"Error fetching content: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching content",
            )

    async def delete_content_service(self, content_id: int, current_user: dict):
        try:
            response = await self.teacher_repo.delete_content_repo(content_id)

            if not response:
                return []
            return response
        except Exception as e:
            print(f"Error deleting content: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching content",
            )

    async def save_chat_id_service(
        self, payload: str, chat_id: str, course_id: int, current_user: dict
    ):
        await self.teacher_repo.save_chat_id_repo(
            payload, chat_id, course_id, current_user
        )

    async def get_chat_id_service(self, course_id: int, current_user: dict):
        return await self.teacher_repo.get_chat_id_repo(course_id, current_user)

    async def get_students_service(self, current_user: dict):
        return await self.teacher_repo.get_students_repo(current_user)

    async def edit_profile_service(
        self, teacher_id: int, form_data: dict, current_user: dict
    ):
        try:
            response = await self.teacher_repo.edit_profile_repo(
                teacher_id, form_data, current_user
            )
            if not response:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
                )
            return response
        except HTTPException:
            raise
        except Exception as e:
            print(f"Error editing profile: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error editing profile",
            )

    async def remove_student_service(self, enrollment_id: int, course_id: int):
        try:
            response = await self.teacher_repo.remove_student_repo(
                enrollment_id, course_id
            )
            if not response:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Enrollment not found"
                )
            return response
        except HTTPException:
            raise
        except Exception as e:
            print(f"Error removing student: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error removing student from course",
            )

    async def delete_with_url(self, url: str, current_user: dict):
        response = await self.teacher_repo.delete_with_url_repo(url, current_user)
        return response

    #   VIdeo Processing

    async def upload_video(self, file: UploadFile):
        try:
            print("📤 Uploading video...")
            video_id = str(uuid.uuid4())
            ext = os.path.splitext(file.filename)[1]
            filename = f"{video_id}{ext}"

            base_dir = os.path.dirname(os.path.abspath(__file__))
            video_dir = os.path.join(base_dir, "static", "videos")

            try:
                os.makedirs(video_dir, exist_ok=True)
                print(f"✅ Directory created: {video_dir}")
            except OSError as dir_error:
                print(f"❌ Directory creation failed: {dir_error}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Could not create video directory: {dir_error}",
                )

            video_path = os.path.join(video_dir, filename)

            try:
                with open(video_path, "wb") as f:
                    f.write(await file.read())
                print(f"✅ Video saved to: {video_path}")
            except OSError as file_error:
                print(f"❌ File write error: {file_error}")
                raise HTTPException(
                    status_code=500, detail=f"Could not save video file: {file_error}"
                )

            return {
                "video_id": video_id,
                "video_path": f"/static/videos/{filename}",
                "status": "uploaded",
            }
        except HTTPException:
            raise
        except Exception as e:
            print("❌ Unexpected upload error:", str(e))
            raise HTTPException(500, detail="Unexpected video upload error")

    def find_ffmpeg(self):
        print("🔍 Searching for FFmpeg...")
        ffmpeg_path = shutil.which("ffmpeg")
        if ffmpeg_path:
            print(f"✅ FFmpeg found: {ffmpeg_path}")
            return ffmpeg_path

        base_dir = os.path.dirname(os.path.abspath(__file__))

        common_paths = [
            os.path.join(base_dir, "static", "ffmpeg", "ffmpeg.exe"),
            os.path.join(base_dir, "ffmpeg.exe"),
        ]

        for path in common_paths:
            if os.path.exists(path):
                print(f"✅ FFmpeg found at fallback path: {path}")
                return path

        print("❌ FFmpeg not found.")
        return None

    def transcribe_with_whisper(self, audio_path: str, url: str):
        try:
            print(f"🧠 Transcribing audio: {audio_path}")
            import whisper
            import torch

            if not os.path.exists(audio_path):
                print(f"❌ Audio file not found: {audio_path}")
                raise FileNotFoundError("Audio file not found")

            print(f"📦 Loading Whisper model: base")
            torch.set_num_threads(4)
            model = whisper.load_model("base")

            print("🎤 Starting transcription...")
            result = model.transcribe(audio_path)
            print("✅ Transcription complete.")
            print(result["segments"])
            parts = url.split("/upload/")
            return [
                {
                    "id": s["id"] + 1,
                    "title": f"Segment {s['id'] +1 } ",
                    "text": s["text"].strip(),
                    "metadata": {
                        "language": result.get("language", "unknown"),
                        "start": round(s["start"], 2),
                        "end": round(s["end"], 2),
                        "duration": round(s["end"] - s["start"], 2),
                        "url": f"{parts[0]}/upload/so_{round(s['start'], 2)}/{parts[1]}",
                    },
                }
                for s in result["segments"]
            ]

        except Exception as e:
            print(f"❌ Whisper error: {traceback.format_exc()}")
            raise

    async def process_video(self, video_id: str, url: str):
        try:
            print(f"🚀 Starting processing for video ID: {video_id}")

            base_dir = os.path.dirname(os.path.abspath(__file__))
            print(f"📁 Base directory: {base_dir}")

            videos_dir = os.path.join(base_dir, "static", "videos")
            audios_dir = os.path.join(base_dir, "static", "audios")
            transcripts_dir = os.path.join(base_dir, "static", "transcripts")

            print(f"🎥 Videos directory: {videos_dir}")
            print(f"🔊 Audios directory: {audios_dir}")
            print(f"📝 Transcripts directory: {transcripts_dir}")

            for directory in [audios_dir, transcripts_dir]:
                try:
                    os.makedirs(directory, exist_ok=True)
                    print(f"✅ Created directory: {directory}")
                except OSError as dir_error:
                    print(f"❌ Failed to create directory {directory}: {dir_error}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Could not create directory: {dir_error}",
                    )

            print(f"🔍 Searching for video files starting with: {video_id}")
            try:
                video_files = [
                    f for f in os.listdir(videos_dir) if f.startswith(video_id)
                ]
                print(f"📂 Found video files: {video_files}")
            except FileNotFoundError:
                print(f"❌ Videos directory not found: {videos_dir}")
                raise HTTPException(404, detail="Videos directory not found")

            if not video_files:
                print("❌ Video file not found.")
                raise HTTPException(404, detail="Video file not found")

            video_path = os.path.join(videos_dir, video_files[0])
            audio_path = os.path.join(audios_dir, f"{video_id}.wav")
            transcript_path = os.path.join(transcripts_dir, f"{video_id}.json")

            print(f"🎞️ Video path: {video_path}")
            print(f"🎧 Audio path: {audio_path}")
            print(f"📝 Transcript path: {transcript_path}")

            if not os.path.exists(video_path):
                print(f"❌ Video file does not exist: {video_path}")
                raise HTTPException(404, detail="Video file not found")

            ffmpeg = self.find_ffmpeg()
            if not ffmpeg:
                raise HTTPException(500, detail="FFmpeg not found")
            print(f"🔧 Using FFmpeg at: {ffmpeg}")

            print("🔊 Extracting audio with FFmpeg...")
            cmd = [
                ffmpeg,
                "-i",
                video_path,
                "-vn",
                "-acodec",
                "pcm_s16le",
                "-ar",
                "16000",
                "-ac",
                "1",
                audio_path,
            ]
            print(f"⚙️ FFmpeg command: {' '.join(cmd)}")

            try:
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                print(f"✅ FFmpeg output: {result.stdout}")
            except subprocess.CalledProcessError as e:
                print(f"❌ FFmpeg error: {e.stderr}")
                raise

            if not os.path.exists(audio_path):
                print("❌ Audio file was not created.")
                raise HTTPException(500, detail="Audio conversion failed")
            print(f"✅ Audio file created: {os.path.getsize(audio_path)} bytes")

            print("🧠 Starting transcription...")
            try:
                transcript = self.transcribe_with_whisper(audio_path, url)
                print(f"✅ Transcription completed with {len(transcript)} segments")
            except Exception as e:
                print(f"❌ Transcription failed: {str(e)}")
                raise

            try:
                with open(transcript_path, "w") as f:
                    json.dump(transcript, f, indent=2)
                print(f"✅ Transcript saved to {transcript_path}")
            except Exception as e:
                print(f"❌ Failed to save transcript: {str(e)}")
                raise

            return {
                "video_id": video_id,
                "transcript": transcript,
                "status": "success",
                "audio_path": audio_path,
                "transcript_path": transcript_path,
            }

        except HTTPException:
            print("❌ HTTPException in process_video")
            raise
        except Exception as e:
            print(f"❌ Unexpected processing error: {traceback.format_exc()}")
            raise HTTPException(500, detail=f"Unexpected error: {str(e)}")
