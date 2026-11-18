import { useStore } from "../store"

export default function Navbar() {
  const { user, go, logout } = useStore()
  return (
    <nav className="bg-teal-700 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => go("home")}>🌍 CeylonExplore</h1>
      <div className="flex gap-4 items-center">
        <button onClick={() => go("home")}>Activities</button>
        {user?.role === "tourist" && <button onClick={() => go("bookings")}>My Bookings</button>}
        {user?.role === "provider" && <button onClick={() => go("provider")}>Provider Dashboard</button>}
        {user?.role === "admin" && <button onClick={() => go("admin")}>Admin Dashboard</button>}
        {user ? (
          <>
            <span className="text-teal-200">{user.name} ({user.role})</span>
            <button onClick={logout} className="bg-white text-teal-700 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <button onClick={() => go("login")} className="bg-white text-teal-700 px-3 py-1 rounded">Login</button>
        )}
      </div>
    </nav>
  )
}
