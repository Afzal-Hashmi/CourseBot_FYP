from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from jose import JWTError, jwt

auth_scheme = OAuth2PasswordBearer(tokenUrl="/login")
async def get_current_user(token: str = Depends(auth_scheme)):
    if token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try: 
        payload = jwt.decode(token, "afzal", algorithms=["HS256"])
        data = payload
        print("/////////////////////////////////////////")
        print(data)
        print("/////////////////////////////////////////")
        if data is None:
            return False
        return data 
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")