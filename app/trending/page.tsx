"use client"

import { useEffect, useState } from "react"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"
import { tmdbApi } from "@/lib/api"
import { TrendingUp, Calendar } from "lucide-react"

interface TrendingItem {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string
  vote_average: number
  release_date?: string
  first_air_date?: string
  media_type: string
}

export default function TrendingPage() {
  const [items, setItems] = useState<TrendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("week")
  const [mediaType, setMediaType] = useState<"all" | "movie" | "tv">("all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      try {
        const data = await tmdbApi.getTrending(mediaType, timeWindow)
        setItems(data.results || [])
      } catch (error) {
        console.error("Error fetching trending content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [mediaType, timeWindow])

  const itemsPerPage = 20
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <TrendingUp className="h-6 w-6 text-amber-500" />
          <h1 className="text-3xl font-bold">Trending Content</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Time:</span>
            <Button
              variant={timeWindow === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeWindow("day")}
              className={timeWindow === "day" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
            >
              Today
            </Button>
            <Button
              variant={timeWindow === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeWindow("week")}
              className={timeWindow === "week" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
            >
              This Week
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Type:</span>
            <Button
              variant={mediaType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setMediaType("all")}
              className={mediaType === "all" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
            >
              All
            </Button>
            <Button
              variant={mediaType === "movie" ? "default" : "outline"}
              size="sm"
              onClick={() => setMediaType("movie")}
              className={mediaType === "movie" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
            >
              Movies
            </Button>
            <Button
              variant={mediaType === "tv" ? "default" : "outline"}
              size="sm"
              onClick={() => setMediaType("tv")}
              className={mediaType === "tv" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
            >
              TV Shows
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {currentItems.map((item) => (
                <MovieCard
                  key={`${item.id}-${item.media_type}`}
                  id={item.id}
                  title={item.title || item.name || ""}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  releaseDate={item.release_date || item.first_air_date || ""}
                  mediaType={item.media_type}
                  overview={item.overview}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
