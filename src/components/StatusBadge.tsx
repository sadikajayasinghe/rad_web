interface StatusBadgeProps {
  status: string
}

const colorMap: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  REJECTED: "bg-rose-100 text-rose-800 border-rose-300",
  CANCELLED: "bg-slate-100 text-slate-700 border-slate-300",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-300",
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const badgeStyle = colorMap[status] || "bg-gray-100 text-gray-800 border-gray-300"

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}
    >
      {status}
    </span>
  )
}
