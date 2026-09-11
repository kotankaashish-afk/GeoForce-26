from pydantic import BaseModel


class Geofence(BaseModel):
    geofence_id: str
    name: str
    latitude: float
    longitude: float
    radius: float