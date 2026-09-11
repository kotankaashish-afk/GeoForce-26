from pydantic import BaseModel


class Attendance(BaseModel):
    employee_id: str
    check_in: str | None = None
    check_out: str | None = None
    overtime_minutes: int = 0