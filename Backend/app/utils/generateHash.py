import bcrypt


def generateHash(password):
    salt = bcrypt.gensalt()
    hashedPassword = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashedPassword.decode("utf-8"), salt.decode("utf-8")


def verifyHash(password: str, hashPassword: str, salt: str):
    verify = bcrypt.hashpw(password.encode("utf-8"), salt.encode("utf-8"))
    return verify.decode("utf-8") == hashPassword
