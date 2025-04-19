from fastapi import APIRouter
from fastapi.responses import JSONResponse


# make router with file name
student_router = APIRouter()


@student_router.post("/student_data")
async def vendorScores():

    data = {
        'name': 'test',
        'email': 'test@gmail.com',
        'contact': '123455567'
    }

    return JSONResponse(content={"success": True, "message": "Student fetched Successful", "status": 200, "data": data})