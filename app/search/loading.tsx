export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mb-4"></div>
      <p className="text-lg text-gray-400">Loading search results...</p>
    </div>
  )
}
