# from fastapi import APIRouter, Depends, Form, HTTPException,status, File, UploadFile
import requests
from fastapi.responses import JSONResponse
import http.client
import json
import uuid
from datetime import datetime

from ...schemas.teacherSchema import course_content_schema, course_schema
from ..controllers.user.TeacherController import TeacherController
from ...utils.auth import get_current_user

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from pydantic import BaseModel
import shutil
import os
from cloudinary import uploader
import cloudinary

teacherRouter = APIRouter()


class AskQuestionSchema(BaseModel):
    question: str
    course_id: int = None 
    chat_id: str = None
    turn_id: str = None

@teacherRouter.get("/teacher/fetchcourses")
async def fetch_courses_router(current_user: dict= Depends(get_current_user), teacher_controller: TeacherController = Depends(TeacherController)):
    if not current_user:
        return JSONResponse(
            content = {
                "succeeded":False,
                'message': 'Authentication failed: Bearder <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            }
        )
    return await teacher_controller.fetch_courses_controller(current_user)

@teacherRouter.delete("/teacher/deletecourse/{course_id}")
async def delete_course_router(course_id: int, current_user: dict= Depends(get_current_user), teacher_controller: TeacherController = Depends(TeacherController)):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded":False,
                'message': 'Authentication failed: Bearer <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            }
        )
    return await teacher_controller.delete_course(course_id, current_user)

@teacherRouter.post('/teacher/createcourse')
async def create_course_router(
    form_Data: course_schema = Depends(course_schema.as_form), 
    file: UploadFile = File(...), 
    current_user:dict = Depends(get_current_user), 
    teacher_controller: TeacherController = Depends(TeacherController)
):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded":False,
                'message': 'Authentication failed: Bearer <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            },
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    return await teacher_controller.create_course_controller(form_Data,current_user,file)


@teacherRouter.put('/teacher/editcourse/{course_id}')
async def edit_course_router(
    course_id: int, 
    form_Data: dict, 
    current_user: dict = Depends(get_current_user), 
    teacher_controller: TeacherController = Depends(TeacherController)
):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded":False,
                'message': 'Authentication failed: Bearer <token> not found',   
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            },
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    return await teacher_controller.edit_course_controller(
        course_id, form_Data, current_user
)

@teacherRouter.get('/teacher/feedback')
async def fetch_feedback_router(current_user: dict = Depends(get_current_user), teacher_controller: TeacherController = Depends(TeacherController)):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded": False,
                'message': 'Authentication failed: Bearer <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            }
        )
    return await teacher_controller.fetch_feedback_controller(current_user)

@teacherRouter.post("/teacher/uploadcontent/")
async def upload_content(
    form_data: course_content_schema = Depends(course_content_schema.as_form),
    file: UploadFile = File(...), 
    current_user:dict = Depends(get_current_user),
    teacher_controller: TeacherController = Depends(TeacherController)
):
    try:
        response = await teacher_controller.upload_content_controller(form_data, file, current_user)
        return response  
            
    except HTTPException:
        raise  
    except Exception as e:
        print(f"Route upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@teacherRouter.post("/teacher/ask/{course_id}")
async def ask_question_from_video(payload: AskQuestionSchema, course_id:int, current_user:dict = Depends(get_current_user), teacher_controller: TeacherController = Depends(TeacherController)):
    try:
        print("Payload received:", payload)
        search_config = {
            "corpora": [
                {
                    "corpus_key": "Tester",
                    "metadata_filter": f"doc.course_id = {payload.course_id}",
                    "lexical_interpolation": 0.025
                }
            ],
            "limit": 50,
            "context_configuration": {
                "sentences_before": 2,
                "sentences_after": 2,
                "start_tag": "%START_SNIPPET%",
                "end_tag": "%END_SNIPPET%"
            }
        }
        
        generation_config = {
            "generation_preset_name": "vectara-summary-ext-24-05-sml",
            "max_used_search_results": 5,
            "prompt_template": "[{\"role\": \"system\", \"content\": \"You are a helpful educational assistant. Provide well-structured responses with clear headings and proper formatting.\"}, #foreach ($qResult in $vectaraQueryResults) {\"role\": \"user\", \"content\": \"${qResult.getText()}\"}, #end {\"role\": \"user\", \"content\": \"Based on the above content, answer: '${vectaraQuery}'\"}]",
            "max_response_characters": 1000,
            "response_language": "auto",
            "model_parameters": {
                "max_tokens": 512,
                "temperature": 0.1,
                "frequency_penalty": 0.0,
                "presence_penalty": 0.0
            },
            "citations": {
                "style": "numeric",
                "url_pattern": "",
                "text_pattern": "[{index}]"
            },
            "enable_factual_consistency_score": True
        }

        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': os.getenv("VECTARA_API_KEY"),
        }

        # Case 1: Continuing an existing chat (has chat_id)
        if payload.chat_id:
            print(f"Continuing chat with ID: {payload.chat_id}")
            url = f"https://api.vectara.io/v2/chats/{payload.chat_id}/turns"
            
            request_payload = {
                "query": payload.question,
                "search": search_config,
                "generation": generation_config,
                "chat": {
                    "store": True
                },
                "save_history": True,
                "stream_response": False
            }
            
        # Case 2: Starting a new chat (no chat_id)
        else:
            print("Starting new chat")
            url = "https://api.vectara.io/v2/chats"
            
            request_payload = {
                "query": payload.question,
                "search": search_config,
                "generation": generation_config,
                "chat": {
                    "store": True
                },
                "save_history": True,
                "stream_response": False
            }

        print(f"Making request to: {url}")
        print(f"Request payload: {json.dumps(request_payload, indent=2)}")

        # Make the API request
        response = requests.post(
            url, 
            headers=headers, 
            data=json.dumps(request_payload)
        )
        
        print(f"Vectara response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Vectara error response: {response.text}")
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"Vectara API error: {response.text}"
            )
        
        vectara_response = response.json()
        if not payload.chat_id:
            await  teacher_controller.save_chat_id(payload.question,vectara_response.get("chat_id"),course_id,current_user)
        print(f"Vectara response: {json.dumps(vectara_response, indent=2)}")
        
        # Extract the response data
        answer = vectara_response.get("answer", "No answer provided")
        chat_id = vectara_response.get("chat_id")
        turn_id = vectara_response.get("turn_id")
        search_results = vectara_response.get("search_results", [])
        
        # Prepare the response
        response_data = {
            "answer": answer,
            "chat_id": chat_id,
            "turn_id": turn_id,
            "search_results": search_results,
            "response_language": vectara_response.get("response_language", "eng")
        }
        
        print(f"Sending response: {response_data}")
        return response_data
        
    except requests.exceptions.RequestException as e:
        print(f"Request error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to connect to Vectara: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# ✅ NEW: Endpoint to list recent chats
@teacherRouter.get("/teacher/list/chats/{course_id}")
async def list_recent_chats(course_id:int,current_user: dict = Depends(get_current_user),  teacher_controller: TeacherController = Depends(TeacherController)):
    try:

        return await teacher_controller.get_chat_id(course_id,current_user) 
        # headers = {
        #     'Accept': 'application/json',
        #     'x-api-key': os.getenv("VECTARA_API_KEY"),
        # }
        
        # List chats from Vectara
        # url = "https://api.vectara.io/v2/chats"
        # response = requests.get(url, headers=headers)
        
        # if response.status_code == 200:
        #     vectara_response = response.json()
        #     chats = vectara_response.get("chats", [])
            
        #     # Format the response for frontend
        #     formatted_chats = []
        #     for chat in chats:
        #         formatted_chats.append({
        #             "chat_id": chat.get("id"),
        #             "title": chat.get("first_query", "Untitled Chat"),
        #             "date": chat.get("created_at", chat.get("modified_at")),
        #             "last_message": chat.get("answer", "")
        #         })
            
        #     return {"chats": formatted_chats}
        # else:
        #     print(f"Failed to fetch chats: {response.text}")
        #     return {"chats": []}
            
    except Exception as e:
        print(f"Error fetching chats: {str(e)}")
        return {"chats": []}


# ✅ NEW: Endpoint to get specific chat history
@teacherRouter.get("/teacher/chat/{chat_id}")
async def get_chat_history(chat_id: str, current_user: dict = Depends(get_current_user)):
    try:

        url = f"https://api.vectara.io/v2/chats/{chat_id}/turns"

        payload = {}
        headers = {
        'Accept': 'application/json',
        'x-api-key': os.getenv("VECTARA_API_KEY"),
        }

        response = requests.request("GET", url, headers=headers, data=payload)

        print(response.text)
        if response.status_code == 200:
            vectara_response = response.json()
            
            # Extract turns/messages from the chat
            turns = vectara_response.get("turns", [])
            messages = []
            
            for turn in turns:
                messages.append({
                    "question": turn.get("query", ""),
                    "answer": turn.get("answer", ""),
                    "timestamp": turn.get("created_at", ""),
                    "turn_id": turn.get("id"),
                    "isLoading": False
                })
            
            return {
                "chat_id": chat_id,
                "title": vectara_response.get("title", "Chat"),
                "messages": messages,
                "last_turn_id": turns[-1].get("id") if turns else None
            }
        else:
            print(f"Failed to fetch chat: {response.text}")
            raise HTTPException(status_code=404, detail="Chat not found")
            
    except Exception as e:
        print(f"Error fetching chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch chat: {str(e)}")




@teacherRouter.get("/teacher/getcontent/{course_id}")
async def get_content(course_id: int, current_user: dict = Depends(get_current_user), teacher_controller: TeacherController = Depends(TeacherController)):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded": False,
                'message': 'Authentication failed: Bearer <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            }
        )
    return await teacher_controller.get_content_controller(course_id)

@teacherRouter.delete("/teacher/deletecontent/{content_id}")
async def delete_content(content_id: int,current_user:dict = Depends(get_current_user), teacher_controller:TeacherController=Depends(TeacherController)):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded":False,
                "message": 'Authentication failed: Bearer <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            }
        )
    return await teacher_controller.delete_content_controller(content_id,current_user)

@teacherRouter.get("/teacher/getstudents")
async def get_students_router(current_user:dict = Depends(get_current_user), teacher_controller:TeacherController=Depends(TeacherController)):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded":False,
                "message": 'Authentication failed : Bearer <token> not found',
                "httpStatusCode": status.HTTP_401_UNAUTHORIZED
            }
        )
    return await teacher_controller.get_students_controller(current_user)