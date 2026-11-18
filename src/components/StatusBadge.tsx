import type { Status } from "../data"

const colors: Record<Status, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-200 text-gray-700",
  COMPLETED: "bg-blue-100 text-blue-800",
}

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`px-3 py-1 rounded-full text-sm ${colors[status]}`}>{status}</span>
}
