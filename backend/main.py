from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.employees import router as employee_router
from backend.routes.geofence import router as geofence_router
from backend.routes.location import router as location_router
from backend.routes.attendance import router as attendance_router

app = FastAPI(
    title="GeoForce Workforce Monitoring API",
    description="Backend for geofenced workforce monitoring.",
    version="1.0.0"
)

app.include_router(employee_router)
app.include_router(geofence_router)
app.include_router(location_router)
app.include_router(attendance_router)

@app.get("/")
def root():
    return {
        "message": "GeoForce API is running"
    }
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }