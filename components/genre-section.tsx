"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/movie-card"
import { tmdbApi } from "@/lib/api"
import { Clapperboard } from "lucide-react"

interface Genre {
  id: number
  name: string
}

interface Movie {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string
  vote_average: number
  release_date?: string
  first_air_date?: string
}

const popularGenres = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
]

export function GenreSection() {
  const [selectedGenre, setSelectedGenre] = useState(popularGenres[0])
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      setLoading(true)
      try {
        const data = await tmdbApi.getMoviesByGenre(selectedGenre.id)
        setMovies(data.results || [])
      } catch (error) {
        console.error("Error fetching movies by genre:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMoviesByGenre()
  }, [selectedGenre])

  return (
    <section className="py-12 px-4 md:px-8 bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <Clapperboard className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl md:text-3xl font-bold">Browse by Genre</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {popularGenres.map((genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre.id === genre.id ? "default" : "outline"}
              onClick={() => setSelectedGenre(genre)}
              className={selectedGenre.id === genre.id ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
            >
              {genre.name}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title || movie.name || ""}
                posterPath={movie.poster_path}
                rating={movie.vote_average}
                releaseDate={movie.release_date || movie.first_air_date || ""}
                mediaType="movie"
                overview={movie.overview}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
