from fastapi import APIRouter, Depends, Form, HTTPException,status, File, UploadFile
from fastapi.responses import JSONResponse

from ...schemas.teacherSchema import course_content_schema, course_schema
from ..controllers.user.TeacherController import TeacherController
from ...utils.auth import get_current_user

teacherRouter = APIRouter()

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

@teacherRouter.post('/teacher/uploadcontent') 
async def upload_content_router(
    form_data: course_content_schema = Depends(course_content_schema.as_form),
    file: UploadFile = File(...),
    teacher_controller: TeacherController = Depends(TeacherController)
):
    try:
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        valid_types = {
            "pdf": ["application/pdf"],
            "video": ["video/mp4", "video/quicktime", "video/webm"],
            "quiz": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
            "code": ["application/zip", "application/x-tar", "application/gzip"]
        }
        
        if form_data.content_type in valid_types and file.content_type not in valid_types[form_data.content_type]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type for {form_data.content_type}. Expected: {valid_types[form_data.content_type]}"
            )
        
        return await teacher_controller.upload_course_controller(form_data, file)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

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