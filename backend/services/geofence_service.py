from geopy.distance import geodesic


def check_geofence(
    employee_lat: float,
    employee_lon: float,
    geofence_lat: float,
    geofence_lon: float,
    radius: float
):
    employee_location = (
        employee_lat,
        employee_lon
    )

    geofence_location = (
        geofence_lat,
        geofence_lon
    )

    distance = geodesic(
        employee_location,
        geofence_location
    ).meters

    inside = distance <= radius

    return {
        "distance": round(distance, 2),
        "inside": inside
    }