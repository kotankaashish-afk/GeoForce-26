from fastapi import APIRouter
from datetime import datetime
from backend.models.location import LocationUpdate
from backend.services.geofence_service import check_geofence
from backend.services.firebase_service import db

router = APIRouter(
    prefix="/api/location",
    tags=["Location"]
)


# Temporary office geofence for testing
OFFICE_LAT = 17.3850
OFFICE_LON = 78.4867
GEOFENCE_RADIUS = 200


@router.post("/check")
def check_employee_location(location: LocationUpdate):

    result = check_geofence(
        employee_lat=location.latitude,
        employee_lon=location.longitude,
        geofence_lat=OFFICE_LAT,
        geofence_lon=OFFICE_LON,
        radius=GEOFENCE_RADIUS
    )

    # Automatically check in if employee is inside the geofence
    if result["inside"]:
        attendance_ref = db.collection("attendance").document(
            location.employee_id
        )

        attendance_doc = attendance_ref.get()

        if not attendance_doc.exists or not attendance_doc.to_dict().get("check_in"):
            check_in_time = datetime.now().isoformat()

            attendance_ref.set({
                "employee_id": location.employee_id,
                "check_in": check_in_time,
                "check_out": None,
                "overtime_minutes": 0
            })

    # Automatically check out if employee leaves the geofence
    else:
        attendance_ref = db.collection("attendance").document(
            location.employee_id
        )

        attendance_doc = attendance_ref.get()

        if attendance_doc.exists:
            attendance_data = attendance_doc.to_dict()

            if attendance_data.get("check_in") and not attendance_data.get("check_out"):
                check_out_time = datetime.now()

                attendance_ref.update({
                    "check_out": check_out_time.isoformat()
                })

    # Always save the employee's latest location
    db.collection("locations").document(
        location.employee_id
    ).set({
        "employee_id": location.employee_id,
        "latitude": location.latitude,
        "longitude": location.longitude,
        "geofence": "Main Office",
        "radius": GEOFENCE_RADIUS,
        "distance": result["distance"],
        "inside_geofence": result["inside"]
    })

    return {
        "message": "Location updated successfully",
        "employee_id": location.employee_id,
        "latitude": location.latitude,
        "longitude": location.longitude,
        "geofence": "Main Office",
        "radius": GEOFENCE_RADIUS,
        "distance": result["distance"],
        "inside_geofence": result["inside"]
    }
@router.get("/{employee_id}")
def get_employee_location(employee_id: str):

    location_ref = db.collection("locations").document(employee_id)
    location_doc = location_ref.get()

    if not location_doc.exists:
        return {
            "message": "No location found",
            "employee_id": employee_id
        }

    location_data = location_doc.to_dict()

    return {
        "employee_id": employee_id,
        "latitude": location_data.get("latitude"),
        "longitude": location_data.get("longitude"),
        "distance": location_data.get("distance"),
        "inside_geofence": location_data.get("inside_geofence")
    }