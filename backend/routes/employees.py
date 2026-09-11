from fastapi import APIRouter
from backend.models.employee import Employee
from backend.services.firebase_service import db

router = APIRouter(
    prefix="/api/employees",
    tags=["Employees"]
)


@router.post("/")
def create_employee(employee: Employee):

    db.collection("employees").document(
        employee.employee_id
    ).set(employee.model_dump())

    return {
        "message": "Employee created successfully",
        "employee": employee
    }
@router.get("/")
def get_all_employees():

    employees_ref = db.collection("employees").stream()

    employees = []

    for employee in employees_ref:
        employee_data = employee.to_dict()
        employee_id = employee.id

        location_doc = db.collection("locations").document(employee_id).get()
        attendance_doc = db.collection("attendance").document(employee_id).get()

        location_data = location_doc.to_dict() if location_doc.exists else {}
        attendance_data = attendance_doc.to_dict() if attendance_doc.exists else {}

        employees.append({
            "employee_id": employee_id,
            "name": employee_data.get("name"),
            "role": employee_data.get("role"),
            "latitude": location_data.get("latitude"),
            "longitude": location_data.get("longitude"),
            "distance": location_data.get("distance"),
            "inside_geofence": location_data.get("inside_geofence"),
            "check_in": attendance_data.get("check_in"),
            "check_out": attendance_data.get("check_out"),
            "overtime_minutes": attendance_data.get("overtime_minutes", 0)
        })

    return {
        "employees": employees
    }   