import { useState } from "react"
import { useStore } from "../store"
import type { Role } from "../data"

export default function Login() {
  const { login } = useStore()
  const [name, setName] = useState("")
  const [role, setRole] = useState<Role>("tourist")

  return (
    <div className="p-6 max-w-sm mx-auto mt-10 bg-white rounded-xl shadow flex flex-col gap-3">
      <h2 className="text-2xl font-bold">Login</h2>
      <input className="border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <select className="border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="tourist">Tourist</option><option value="provider">Activity Provider</option><option value="admin">Admin</option>
      </select>
      <button disabled={!name} onClick={() => login({ name, role })} className="bg-teal-600 text-white py-2 rounded disabled:opacity-40">Login</button>

      <p className="text-xs text-gray-400 mt-2">Quick demo logins (no real password yet):</p>
      <div className="flex flex-wrap gap-2 text-sm">
        <button className="border rounded px-2 py-1" onClick={() => login({ name: "Alex", role: "tourist" })}>Alex (Tourist)</button>
        <button className="border rounded px-2 py-1" onClick={() => login({ name: "Lanka Tours", role: "provider" })}>Lanka Tours (Provider)</button>
        <button className="border rounded px-2 py-1" onClick={() => login({ name: "Admin", role: "admin" })}>Admin</button>
      </div>
    </div>
  )
}
