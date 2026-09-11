from pydantic import BaseModel


class LocationUpdate(BaseModel):
    employee_id: str
    latitude: float
    longitude: float