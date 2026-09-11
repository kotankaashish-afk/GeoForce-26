import { useEffect, useMemo, useState } from 'react'
import MapView from '../components/MapView'

const API_BASE_URL = 'http://127.0.0.1:8000'

const statusStyles = {
  Working: 'bg-[#e4ebe1] text-[#657860] border-[#cdd8c9]',
  Late: 'bg-[#f3eadc] text-[#9a7848] border-[#e2d2b9]',
  Outside: 'bg-[#f3e3de] text-[#a56854] border-[#e5cec5]',
}

const formatTime = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ManagerDashboard() {
  const [employees, setEmployees] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/`)
      if (!response.ok) throw new Error(`Backend returned ${response.status}`)
      const data = await response.json()
      setEmployees((data.employees || []).map((employee) => ({
        ...employee,
        id: employee.employee_id,
        position: employee.latitude != null && employee.longitude != null ? [employee.latitude, employee.longitude] : null,
        status: employee.inside_geofence ? 'Working' : employee.check_in ? 'Outside' : 'Outside',
        checkIn: formatTime(employee.check_in),
        overtime: `${Math.floor((employee.overtime_minutes || 0) / 60).toString().padStart(2, '0')}:${((employee.overtime_minutes || 0) % 60).toString().padStart(2, '0')}`,
      })))
      setError('')
    } catch (err) {
      console.error('Failed to load employees:', err)
      setError('Unable to connect to the workforce server.')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    loadEmployees()
    const interval = setInterval(loadEmployees, 5000)
    return () => clearInterval(interval)
  }, [])

  const working = useMemo(() => employees.filter((e) => e.inside_geofence).length, [employees])
  const outside = useMemo(() => employees.filter((e) => !e.inside_geofence).length, [employees])
  const selected = employees.find((e) => e.id === selectedEmployeeId)

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#292824] page-enter">
      <header className="sticky top-0 z-30 border-b border-[#ded6c9] bg-[#fffdf8]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#292824] text-lg text-[#f6f2ea] shadow-[0_8px_20px_rgba(41,40,36,.18)]">⌖</div><div><p className="text-[15px] font-bold tracking-tight">GeoForce</p><p className="text-[11px] font-medium tracking-wide text-[#8b8479]">WORKFORCE INTELLIGENCE</p></div></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold">Manager</p><p className="text-[11px] text-[#91897e]">Operations</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7dfd2] text-sm font-bold text-[#625b51]">M</div></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:py-10">
        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#a28f76]">Operations overview</p><h1 className="text-3xl font-bold tracking-[-.03em] sm:text-4xl">Good morning, Manager.</h1><p className="mt-2 text-sm text-[#777066]">A live view of your workforce, attendance and location status.</p></div><div className="flex items-center gap-2 rounded-full border border-[#dcd4c8] bg-[#fffdf8] px-4 py-2.5 text-xs font-semibold text-[#665f55]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#7c8c78]" />Live • updates every 5 sec</div></section>

        <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total employees" value={employees.length} hint="Tracked today" />
          <StatCard label="On site" value={working} hint="Inside geofence" tone="sage" />
          <StatCard label="Outside" value={outside} hint="Needs attention" tone="terra" />
          <StatCard label="Selected" value={selected ? selected.name.split(' ')[0] : '—'} hint={selected ? selected.role : 'Choose an employee'} />
        </section>

        {error && <div className="mb-5 rounded-2xl border border-[#e5c9c0] bg-[#f7e9e4] px-5 py-4 text-sm font-medium text-[#a56854]">{error}</div>}

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="soft-card overflow-hidden rounded-[28px]">
            <div className="flex items-center justify-between border-b border-[#ebe4d9] px-5 py-4 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a28f76]">Live map</p><h2 className="mt-1 text-lg font-bold">Workforce locations</h2></div><div className="flex items-center gap-2 text-xs text-[#7d766c]"><span className="h-2 w-2 rounded-full bg-[#7c8c78]" />Geofence active</div></div>
            <div className="h-[520px] sm:h-[600px]"><MapView employees={employees} selectedEmployeeId={selectedEmployeeId} /></div>
          </div>

          <aside className="soft-card overflow-hidden rounded-[28px]">
            <div className="border-b border-[#ebe4d9] px-5 py-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a28f76]">People</p><h2 className="mt-1 text-lg font-bold">Employees</h2></div><span className="rounded-full bg-[#eee8de] px-3 py-1 text-[11px] font-bold text-[#766e63]">{employees.length} tracked</span></div></div>
            <div className="max-h-[600px] overflow-y-auto p-2">
              {loading && employees.length === 0 ? <div className="space-y-2 p-2">{[1,2,3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#f0ebe3]" />)}</div> : employees.length === 0 ? <div className="p-8 text-center text-sm text-[#91897e]">No employees found.</div> : employees.map((employee) => {
                const selectedRow = selectedEmployeeId === employee.id
                return <button key={employee.id} onClick={() => setSelectedEmployeeId(employee.id)} className={`w-full rounded-2xl p-4 text-left transition duration-200 ${selectedRow ? 'bg-[#eee7dc] shadow-[inset_3px_0_0_#7c8c78]' : 'hover:bg-[#f5f1e9]'}`}>
                  <div className="flex items-center gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${selectedRow ? 'bg-[#292824] text-[#fffdf8]' : 'bg-[#e8e0d4] text-[#625b51]'}`}>{employee.name?.split(' ').map((x) => x[0]).join('').slice(0,2)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{employee.name}</p><p className="mt-0.5 truncate text-xs text-[#8a8277]">{employee.role || 'Employee'}</p></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles[employee.status] || statusStyles.Outside}`}>{employee.status}</span></div>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#e8e1d7] pt-3"><div><p className="text-[10px] uppercase tracking-wide text-[#a0988d]">Check-in</p><p className="mt-1 text-xs font-semibold text-[#5f594f]">{employee.checkIn}</p></div><div><p className="text-[10px] uppercase tracking-wide text-[#a0988d]">Overtime</p><p className="mt-1 text-xs font-semibold text-[#5f594f]">{employee.overtime}</p></div></div>
                </button>
              })}
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

function StatCard({ label, value, hint, tone }) {
  const accent = tone === 'sage' ? 'text-[#657860]' : tone === 'terra' ? 'text-[#a56854]' : 'text-[#393732]'
  return <div className="soft-card rounded-[22px] p-5"><p className="text-xs font-medium text-[#91897e]">{label}</p><p className={`mt-2 text-3xl font-bold tracking-[-.03em] ${accent}`}>{value}</p><p className="mt-1 text-xs text-[#a0988d]">{hint}</p></div>
}

export default ManagerDashboard
