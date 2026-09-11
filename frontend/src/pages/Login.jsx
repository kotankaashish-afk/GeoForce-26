import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    // Temporary hackathon login
    if (email.includes('manager')) {
      navigate('/manager')
    } else {
      navigate('/employee')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 relative overflow-hidden">
      <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-[#d8c8a8]/25 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#b8c2b0]/30 blur-3xl" />

      <div className="w-full max-w-5xl grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center relative z-10">
        <section className="hidden lg:block px-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-stone-900/10 bg-white/55 px-4 py-2 shadow-sm backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7c8c78] shadow-[0_0_0_5px_rgba(124,140,120,.14)]" />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-600">
              Workforce intelligence
            </span>
          </div>

          <h1 className="mt-7 text-6xl font-semibold tracking-[-0.045em] text-stone-900 leading-[0.98]">
            GeoForce
            <span className="block text-stone-500">at a glance.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-stone-500">
            A calm, location-aware workspace for understanding where your team is,
            when they arrived, and how the shift is progressing.
          </p>

          <div className="mt-9 flex gap-3">
            {['Live locations', 'Auto attendance', 'Overtime'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-stone-900/10 bg-white/60 px-4 py-2 text-xs font-medium text-stone-600 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <div>
          <div className="mb-5 text-center lg:hidden">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-900 text-2xl text-white shadow-[0_12px_28px_rgba(41,40,35,.2)]">
              ◎
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-900">GeoForce</h1>
            <p className="mt-1 text-sm text-stone-500">Smart workforce monitoring</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white/82 border border-stone-900/10 rounded-[28px] p-7 sm:p-9 shadow-[0_28px_80px_rgba(71,61,45,.13)] backdrop-blur-xl"
          >
            <div className="mb-8">
              <div className="mb-5 hidden h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-xl text-white shadow-lg lg:flex">
                ◎
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Sign in to continue to your GeoForce workspace.
              </p>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-2xl border bg-stone-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400"
              />
            </div>

            <div className="mb-7">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border bg-stone-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400"
              />
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-stone-900 py-3.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(41,40,35,.18)] transition hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-[0_16px_30px_rgba(41,40,35,.22)]"
            >
              Enter workspace
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-stone-400">
            GeoForce-26 · Workforce intelligence platform
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
