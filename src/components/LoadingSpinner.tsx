export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  )
}
