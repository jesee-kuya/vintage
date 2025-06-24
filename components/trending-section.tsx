"use client"

import { useEffect, useState } from "react"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { tmdbApi } from "@/lib/api"
import { TrendingUp } from "lucide-react"

interface Movie {
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

export function TrendingSection() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTvShows] = useState<Movie[]>([])
  const [activeTab, setActiveTab] = useState<"movie" | "tv">("movie")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const [movieData, tvData] = await Promise.all([
          tmdbApi.getTrending("movie", "week"),
          tmdbApi.getTrending("tv", "week"),
        ])

        setMovies(movieData.results || [])
        setTvShows(tvData.results || [])
      } catch (error) {
        console.error("Error fetching trending content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  const currentItems = activeTab === "movie" ? movies : tvShows

  if (loading) {
    return (
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === "movie" ? "default" : "outline"}
              onClick={() => setActiveTab("movie")}
              className={activeTab === "movie" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
            >
              Movies
            </Button>
            <Button
              variant={activeTab === "tv" ? "default" : "outline"}
              onClick={() => setActiveTab("tv")}
              className={activeTab === "tv" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
            >
              TV Shows
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {currentItems.slice(0, 12).map((item) => (
            <MovieCard
              key={item.id}
              id={item.id}
              title={item.title || item.name || ""}
              posterPath={item.poster_path}
              rating={item.vote_average}
              releaseDate={item.release_date || item.first_air_date || ""}
              mediaType={activeTab}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
