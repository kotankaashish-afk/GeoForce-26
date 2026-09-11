from fastapi import APIRouter
from datetime import datetime
from backend.services.firebase_service import db

router = APIRouter(
    prefix="/api/attendance",
    tags=["Attendance"]
)


@router.post("/check-in/{employee_id}")
def check_in(employee_id: str):

    check_in_time = datetime.now().isoformat()

    db.collection("attendance").document(employee_id).set({
        "employee_id": employee_id,
        "check_in": check_in_time,
        "check_out": None,
        "overtime_minutes": 0
    })

    return {
        "message": "Employee checked in successfully",
        "employee_id": employee_id,
        "check_in": check_in_time
    }
@router.post("/check-out/{employee_id}")
def check_out(employee_id: str):

    check_out_time = datetime.now()

    # Get employee's shift information
    employee_ref = db.collection("employees").document(employee_id)
    employee_doc = employee_ref.get()

    if not employee_doc.exists:
        return {
            "message": "Employee not found",
            "employee_id": employee_id
        }

    employee_data = employee_doc.to_dict()
    shift_end_str = employee_data.get("shift_end")

    if not shift_end_str:
        return {
            "message": "Shift end time not found",
            "employee_id": employee_id
        }

    # Convert shift end time into today's datetime
    shift_end = datetime.strptime(
        shift_end_str,
        "%H:%M"
    ).replace(
        year=check_out_time.year,
        month=check_out_time.month,
        day=check_out_time.day
    )

    overtime_minutes = 0

    if check_out_time > shift_end:
        overtime = check_out_time - shift_end
        overtime_minutes = int(
            overtime.total_seconds() / 60
        )

    db.collection("attendance").document(employee_id).update({
        "check_out": check_out_time.isoformat(),
        "overtime_minutes": overtime_minutes
    })

    return {
        "message": "Employee checked out successfully",
        "employee_id": employee_id,
        "check_out": check_out_time.isoformat(),
        "overtime_minutes": overtime_minutes
    }
@router.get("/{employee_id}")
def get_attendance(employee_id: str):

    attendance_ref = db.collection("attendance").document(employee_id)
    attendance_doc = attendance_ref.get()

    if not attendance_doc.exists:
        return {
            "message": "No attendance record found",
            "employee_id": employee_id
        }

    return attendance_doc.to_dict()