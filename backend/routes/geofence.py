from fastapi import APIRouter
from backend.models.geofence import Geofence

router = APIRouter(
    prefix="/api/geofences",
    tags=["Geofences"]
)


@router.post("/")
def create_geofence(geofence: Geofence):
    return {
        "message": "Geofence created successfully",
        "geofence": geofence
    }