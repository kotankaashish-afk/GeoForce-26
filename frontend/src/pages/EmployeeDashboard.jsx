import { useEffect, useState } from 'react'

const GEOFENCE_CENTER = {
  latitude: 17.4485,
  longitude: 78.3908,
}

const GEOFENCE_RADIUS = 1500

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000

  const latDifference = ((lat2 - lat1) * Math.PI) / 180
  const lonDifference = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(lonDifference / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}

function EmployeeDashboard() {
  const [location, setLocation] = useState(null)
  const [distance, setDistance] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError(
        'Geolocation is not supported by this browser.'
      )
      return
    }

    setIsTracking(true)

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords

        const distanceFromOffice = calculateDistance(
          latitude,
          longitude,
          GEOFENCE_CENTER.latitude,
          GEOFENCE_CENTER.longitude
        )

        setLocation({
          latitude,
          longitude,
          accuracy,
        })

        setDistance(distanceFromOffice)
        setLocationError('')
        setIsTracking(true)
      },
      (error) => {
        setIsTracking(false)

        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            'Location permission was denied. Please allow location access.'
          )
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError(
            'Your current location could not be determined.'
          )
        } else if (error.code === error.TIMEOUT) {
          setLocationError(
            'Location request timed out. Trying again...'
          )
        } else {
          setLocationError(
            'Unable to access your location.'
          )
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const insideGeofence =
    distance !== null && distance <= GEOFENCE_RADIUS

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            📍
          </div>

          <div>
            <h1 className="font-bold text-lg">
              GeoForce
            </h1>

            <p className="text-xs text-slate-500">
              Workforce monitoring
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isTracking
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-red-400'
            }`}
          />

          <span className="text-sm text-slate-400">
            {isTracking
              ? 'Location tracking'
              : 'Location inactive'}
          </span>

        </div>

      </header>

      {/* Main */}
      <main className="p-6 max-w-5xl mx-auto">

        {/* Greeting */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold">
            Good morning, Rahul 👋
          </h2>

          <p className="text-slate-400 mt-1">
            Your location and attendance are being monitored automatically.
          </p>

        </div>

        {/* Location cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Attendance status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h3 className="font-semibold text-lg">
                  Attendance Status
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Based on your current location
                </p>
              </div>

              <span className="text-2xl">
                {insideGeofence ? '🟢' : '🔴'}
              </span>

            </div>

            {locationError ? (

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">

                <p className="text-red-400 font-medium">
                  Location unavailable
                </p>

                <p className="text-sm text-red-300/70 mt-1">
                  {locationError}
                </p>

              </div>

            ) : distance === null ? (

              <div className="bg-slate-800/50 rounded-xl p-5">

                <div className="flex items-center gap-3">

                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />

                  <p className="text-slate-300">
                    Getting your location...
                  </p>

                </div>

              </div>

            ) : (

              <div
                className={`rounded-xl p-5 border ${
                  insideGeofence
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >

                <p
                  className={`text-2xl font-bold ${
                    insideGeofence
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}
                >
                  {insideGeofence
                    ? 'Inside Geofence'
                    : 'Outside Geofence'}
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  {insideGeofence
                    ? 'You are within the designated work area.'
                    : 'You are outside the designated work area.'}
                </p>

              </div>

            )}

          </div>

          {/* Current location */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h3 className="font-semibold text-lg">
              Current Location
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Live GPS information
            </p>

            {location ? (

              <div className="space-y-4">

                <div>
                  <p className="text-xs text-slate-500">
                    Latitude
                  </p>

                  <p className="text-slate-200 font-mono mt-1">
                    {location.latitude.toFixed(6)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Longitude
                  </p>

                  <p className="text-slate-200 font-mono mt-1">
                    {location.longitude.toFixed(6)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    GPS Accuracy
                  </p>

                  <p className="text-slate-200 mt-1">
                    ±{Math.round(location.accuracy)} m
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Distance from workplace
                  </p>

                  <p className="text-blue-400 font-semibold mt-1">
                    {distance < 1000
                      ? `${Math.round(distance)} m`
                      : `${(distance / 1000).toFixed(2)} km`}
                  </p>
                </div>

              </div>

            ) : (

              <p className="text-slate-500">
                Waiting for GPS location...
              </p>

            )}

          </div>

        </div>

        {/* Automatic attendance */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
              ⏱️
            </div>

            <div className="flex-1">

              <h3 className="font-semibold">
                Automatic Attendance
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                GeoForce automatically checks you in when you enter the designated work area.
              </p>

            </div>

            <div
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                insideGeofence
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : distance === null
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-red-500/10 text-red-400'
              }`}
            >
              {insideGeofence
                ? 'CHECKED IN'
                : distance === null
                  ? 'WAITING'
                  : 'NOT CHECKED IN'}
            </div>

          </div>

        </div>

        {/* Work shift */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

          <InfoCard
            title="Shift"
            value="09:00 AM"
          />

          <InfoCard
            title="Check-in"
            value={insideGeofence ? 'Automatic' : '--'}
          />

          <InfoCard
            title="Hours Worked"
            value="00:00"
          />

          <InfoCard
            title="Overtime"
            value="00:00"
          />

        </div>

      </main>

    </div>
  )
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="text-lg font-semibold mt-2">
        {value}
      </p>

    </div>
  )
}

export default EmployeeDashboard