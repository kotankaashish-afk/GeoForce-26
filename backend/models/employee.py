from pydantic import BaseModel


class Employee(BaseModel):
    employee_id: str
    name: str
    email: str
    role: str
    shift_start: str
    shift_end: str