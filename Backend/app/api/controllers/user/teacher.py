from fastapi import APIRouter
from fastapi.responses import JSONResponse


# make router with file name
<<<<<<< HEAD:Backend/app/api/endpoints/user.py
# kzndxhjsbdjnxj
user_router = APIRouter()
=======
teacher_router = APIRouter()
>>>>>>> e58403e101065d5dcdcb9461a1022a292762c203:Backend/app/api/controllers/user/teacher.py


@teacher_router.post("/teacher_data")
async def vendorScores():

    data = {"name": "test", "email": "test@gmail.com", "contact": "123455567"}

    return JSONResponse(
        content={
            "success": True,
            "message": "User fetched Successful",
            "status": 200,
            "data": data,
        }
    )
