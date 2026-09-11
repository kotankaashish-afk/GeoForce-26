import { useEffect, useState } from 'react'

const API_BASE_URL = 'http://127.0.0.1:8000'
const EMPLOYEE_ID = 'EMP001'

function EmployeeDashboard() {
  const [location, setLocation] = useState(null)
  const [attendance, setAttendance] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }
    setIsTracking(true)
    const watchId = navigator.geolocation.watchPosition(async (position) => {
      const { latitude, longitude, accuracy } = position.coords
      setLocation({ latitude, longitude, accuracy })
      setLocationError('')
      setIsTracking(true)
      setIsUpdating(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/location/check`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: EMPLOYEE_ID, latitude, longitude }),
        })
        if (!response.ok) throw new Error(`Backend returned ${response.status}`)
        setAttendance(await response.json())
      } catch (error) {
        console.error('Failed to update location:', error)
        setLocationError('Unable to connect to the attendance server.')
      } finally { setIsUpdating(false) }
    }, (error) => {
      setIsTracking(false)
      if (error.code === error.PERMISSION_DENIED) setLocationError('Location permission was denied. Please allow location access.')
      else if (error.code === error.POSITION_UNAVAILABLE) setLocationError('Your current location could not be determined.')
      else if (error.code === error.TIMEOUT) setLocationError('Location request timed out. Trying again...')
      else setLocationError('Unable to access your location.')
    }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 })
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const inside = attendance?.inside_geofence === true
  const hasLocation = location !== null
  const overtimeMinutes = attendance?.overtime_minutes ?? 0
  const formatTime = (value) => {
    if (!value) return '--'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#292824] page-enter">
      <header className="sticky top-0 z-20 border-b border-[#ded6c9] bg-[#fffdf8]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#292824] text-lg text-[#f6f2ea] shadow-[0_8px_20px_rgba(41,40,36,.18)]">⌖</div><div><p className="text-[15px] font-bold tracking-tight">GeoForce</p><p className="text-[11px] font-medium text-[#8b8479]">WORKFORCE INTELLIGENCE</p></div></div>
          <div className="flex items-center gap-2 rounded-full border border-[#dcd4c8] bg-white/70 px-3 py-2 text-xs font-semibold text-[#665f55]"><span className={`h-2 w-2 rounded-full ${isTracking ? 'bg-[#7c8c78] animate-pulse' : 'bg-[#b87861]'}`} />{isTracking ? 'Live tracking' : 'Tracking inactive'}</div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#a28f76]">Employee workspace</p><h1 className="text-3xl font-bold tracking-[-.03em] sm:text-4xl">Good morning, Rayyan.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#777066]">Your attendance is handled automatically while GeoForce keeps your location status up to date.</p></div><div className="rounded-2xl border border-[#ded6c9] bg-[#ebe3d6] px-4 py-3 text-sm text-[#625b51]"><span className="font-semibold">Shift</span><span className="mx-2 text-[#aaa092]">•</span>09:00 AM — 06:00 PM</div></section>
        <section className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <div className="soft-card overflow-hidden rounded-[28px]"><div className="flex items-start justify-between border-b border-[#ebe4d9] p-6 sm:p-7"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a28f76]">Attendance status</p><h2 className="mt-2 text-2xl font-bold tracking-tight">{inside ? 'You are on site' : 'Outside work area'}</h2><p className="mt-1 text-sm text-[#80786d]">Based on your current GPS position</p></div><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${inside ? 'bg-[#e4ebe1] text-[#667963]' : 'bg-[#f1e2dc] text-[#a56854]'}`}><span className="text-xl">{inside ? '✓' : '⌖'}</span></div></div><div className="p-6 sm:p-7">{locationError ? <div className="rounded-2xl border border-[#e5c9c0] bg-[#f7e9e4] p-5"><p className="font-semibold text-[#a56854]">Location unavailable</p><p className="mt-1 text-sm text-[#8e6557]">{locationError}</p></div> : !hasLocation ? <div className="rounded-2xl bg-[#f2eee7] p-6"><div className="flex items-center gap-3 text-sm text-[#70695f]"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#a28f76]" />Acquiring your location…</div></div> : <div className={`rounded-[22px] border p-6 ${inside ? 'border-[#cdd8c9] bg-[#edf2eb]' : 'border-[#e5cec5] bg-[#f8ece8]'}`}><div className="flex items-end justify-between gap-4"><div><p className={`text-3xl font-bold tracking-tight ${inside ? 'text-[#657860]' : 'text-[#a56854]'}`}>{inside ? 'Inside geofence' : 'Outside geofence'}</p><p className="mt-2 text-sm text-[#766f66]">{inside ? 'Your location is within the designated work area.' : 'Move into the designated work area to be automatically checked in.'}</p></div>{isUpdating && <span className="shrink-0 text-xs font-semibold text-[#8c816f]">Syncing…</span>}</div></div>}</div></div>
          <div className="soft-card rounded-[28px] p-6 sm:p-7"><div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a28f76]">Live telemetry</p><h2 className="mt-2 text-xl font-bold">Current location</h2></div><span className="rounded-full bg-[#eee8de] px-3 py-1 text-[11px] font-bold tracking-wide text-[#766e63]">GPS</span></div>{location ? <div className="space-y-4">{[['Latitude', location.latitude.toFixed(6)], ['Longitude', location.longitude.toFixed(6)], ['Accuracy', `±${Math.round(location.accuracy)} m`]].map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-[#eee8df] pb-3"><span className="text-xs font-medium text-[#91897e]">{label}</span><span className="font-mono text-sm font-semibold text-[#403d38]">{value}</span></div>)}<div className="rounded-2xl bg-[#f1ece4] p-4"><p className="text-xs text-[#8c8479]">Distance from workplace</p><p className="mt-1 text-2xl font-bold text-[#625a50]">{attendance?.distance !== undefined ? attendance.distance < 1000 ? `${Math.round(attendance.distance)} m` : `${(attendance.distance / 1000).toFixed(2)} km` : '--'}</p></div></div> : <p className="text-sm text-[#91897e]">Waiting for GPS location…</p>}</div>
        </section>
        <section className="soft-card mt-5 rounded-[28px] p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ebe3d6] text-xl">◷</div><div className="flex-1"><h3 className="font-bold">Automatic attendance</h3><p className="mt-1 text-sm leading-5 text-[#81796f]">Check-in and check-out are triggered by your location and work area.</p></div><span className={`w-fit rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide ${inside ? 'bg-[#e2ebe0] text-[#667963]' : !attendance ? 'bg-[#eee9e0] text-[#8a8277]' : 'bg-[#f3e3de] text-[#a56854]'}`}>{inside ? 'CHECKED IN' : !attendance ? 'WAITING' : 'NOT CHECKED IN'}</span></div></section>
        <section className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">{[['Shift', '09:00 AM'], ['Check-in', formatTime(attendance?.check_in)], ['Hours worked', '--'], ['Overtime', `${overtimeMinutes} min`]].map(([title, value]) => <div key={title} className="soft-card rounded-2xl p-5"><p className="text-xs font-medium text-[#91897e]">{title}</p><p className="mt-2 text-lg font-bold tracking-tight text-[#393732]">{value}</p></div>)}</section>
      </main>
    </div>
  )
}

export default EmployeeDashboard
