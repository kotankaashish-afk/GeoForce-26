import MapView from '../components/MapView'

// Temporary mock data
const employees = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Field Engineer',
    status: 'Working',
    checkIn: '09:02 AM',
    overtime: '00:42',
  },
  {
    id: 2,
    name: 'Priya Reddy',
    role: 'Sales Executive',
    status: 'Working',
    checkIn: '08:57 AM',
    overtime: '00:18',
  },
  {
    id: 3,
    name: 'Arjun Kumar',
    role: 'Technician',
    status: 'Late',
    checkIn: '09:47 AM',
    overtime: '00:00',
  },
  {
    id: 4,
    name: 'Sameer Khan',
    role: 'Field Agent',
    status: 'Outside',
    checkIn: '08:51 AM',
    overtime: '01:05',
  },
]

const statusStyles = {
  Working: 'bg-emerald-500/10 text-emerald-400',
  Late: 'bg-amber-500/10 text-amber-400',
  Outside: 'bg-red-500/10 text-red-400',
}

function ManagerDashboard() {
  const working = employees.filter(
    (employee) => employee.status === 'Working'
  ).length

  const late = employees.filter(
    (employee) => employee.status === 'Late'
  ).length

  const outside = employees.filter(
    (employee) => employee.status === 'Outside'
  ).length

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

        <div className="flex items-center gap-4">

          <button className="text-slate-400 hover:text-white">
            🔔
          </button>

          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center">
              M
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium">
                Manager
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

          </div>

        </div>

      </header>

      <main className="p-6">

        {/* Page heading */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold">
            Good morning, Manager 👋
          </h2>

          <p className="text-slate-400 mt-1">
            Here's what's happening with your workforce today.
          </p>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <StatCard
            title="Total Employees"
            value={employees.length}
            icon="👥"
          />

          <StatCard
            title="Working"
            value={working}
            icon="🟢"
          />

          <StatCard
            title="Late"
            value={late}
            icon="🟠"
          />

          <StatCard
            title="Outside Geofence"
            value={outside}
            icon="🔴"
          />

        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Map */}
          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="p-4 border-b border-slate-800">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    Live Workforce Map
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Real-time employee locations
                  </p>

                </div>

                <span className="flex items-center gap-2 text-xs text-emerald-400">

                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                  LIVE

                </span>

              </div>

            </div>

            <div className="h-[500px]">
              <MapView />
            </div>

          </div>

          {/* Employee list */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="p-4 border-b border-slate-800">

              <h3 className="font-semibold">
                Employees
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                {employees.length} employees tracked
              </p>

            </div>

            <div className="divide-y divide-slate-800">

              {employees.map((employee) => (

                <div
                  key={employee.id}
                  className="p-4 hover:bg-slate-800/50 transition"
                >

                  <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-semibold">
                      {employee.name.charAt(0)}
                    </div>

                    {/* Employee info */}
                    <div className="flex-1 min-w-0">

                      <p className="font-medium truncate">
                        {employee.name}
                      </p>

                      <p className="text-xs text-slate-500 truncate">
                        {employee.role}
                      </p>

                    </div>

                    {/* Status */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        statusStyles[employee.status]
                      }`}
                    >
                      {employee.status}
                    </span>

                  </div>

                  {/* Attendance information */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">

                    <div>

                      <p className="text-slate-500">
                        Check-in
                      </p>

                      <p className="text-slate-300 mt-1">
                        {employee.checkIn}
                      </p>

                    </div>

                    <div>

                      <p className="text-slate-500">
                        Overtime
                      </p>

                      <p className="text-slate-300 mt-1">
                        {employee.overtime}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-400">
          {title}
        </p>

        <span>
          {icon}
        </span>

      </div>

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>

    </div>
  )
}

export default ManagerDashboard