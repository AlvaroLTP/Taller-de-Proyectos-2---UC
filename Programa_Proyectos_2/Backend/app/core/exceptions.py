from fastapi import HTTPException, status

class AppError(HTTPException):
    def __init__(self, status_code: int = status.HTTP_400_BAD_REQUEST, detail: str = 'Bad request'):
        super().__init__(status_code=status_code, detail=detail)

