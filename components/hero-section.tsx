"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Play, Info, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { tmdbApi } from "@/lib/api"

interface Movie {
  id: number
  title: string
  overview: string
  backdrop_path: string
  poster_path: string
  vote_average: number
  release_date: string
  genre_ids: number[]
}

export function HeroSection() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const data = await tmdbApi.getTrending("movie", "day")
        if (data.results && data.results.length > 0) {
          setFeaturedMovie(data.results[0])
        }
      } catch (error) {
        console.error("Error fetching featured movie:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMovie()
  }, [])

  if (loading || !featuredMovie) {
    return (
      <div className="relative h-[70vh] bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
      </div>
    )
  }

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <Image
        src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
        alt={featuredMovie.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              Featured
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-300">{featuredMovie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {featuredMovie.title}
          </h1>

          <p className="text-lg text-gray-300 mb-6 max-w-2xl line-clamp-3">{featuredMovie.overview}</p>

          <div className="flex items-center space-x-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              <Play className="h-5 w-5 mr-2 fill-current" />
              Watch Trailer
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <Info className="h-5 w-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
