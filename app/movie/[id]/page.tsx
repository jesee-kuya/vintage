"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, Calendar, Clock, Play, Plus, Check, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MovieCard } from "@/components/movie-card"
import { tmdbApi, omdbApi } from "@/lib/api"
import { useWatchlist } from "@/hooks/use-watchlist"

interface MovieDetails {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  release_date: string
  runtime: number
  genres: { id: number; name: string }[]
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string }[]
    crew: { id: number; name: string; job: string }[]
  }
  videos: {
    results: { key: string; type: string; site: string; name: string }[]
  }
  similar: {
    results: any[]
  }
  imdb_id: string
}

export default function MoviePage() {
  const params = useParams()
  const id = Number.parseInt(params.id as string)
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [omdbData, setOmdbData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()

  const inWatchlist = movie ? isInWatchlist(movie.id, "movie") : false

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieData = await tmdbApi.getMovieDetails(id)
        setMovie(movieData)

        // Fetch additional data from OMDB if IMDB ID is available
        if (movieData.imdb_id) {
          try {
            const omdbDetails = await omdbApi.getDetails(movieData.imdb_id)
            setOmdbData(omdbDetails)
          } catch (error) {
            console.error("Error fetching OMDB data:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching movie details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  const handleWatchlistToggle = () => {
    if (!movie) return

    if (inWatchlist) {
      removeFromWatchlist(movie.id, "movie")
    } else {
      addToWatchlist({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        media_type: "movie",
        overview: movie.overview,
      })
    }
  }

  const getTrailer = () => {
    if (!movie?.videos?.results) return null
    return movie.videos.results.find((video) => video.type === "Trailer" && video.site === "YouTube")
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="relative h-[50vh] bg-gray-900 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
            </div>
            <div className="h-96 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-2">Movie Not Found</h2>
          <p className="text-gray-500">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const trailer = getTrailer()
  const director = movie.credits?.crew?.find((person) => person.job === "Director")

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                Movie
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-300">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {movie.title}
            </h1>

            <div className="flex items-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              {movie.runtime && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {trailer && (
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  <Play className="h-5 w-5 mr-2 fill-current" />
                  Watch Trailer
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={handleWatchlistToggle} className="border-gray-600">
                {inWatchlist ? (
                  <>
                    <Check className="h-5 w-5 mr-2 text-green-400" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add to Watchlist
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600">
                <Share className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <Badge key={genre.id} variant="outline" className="border-gray-600">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movie.credits.cast.slice(0, 8).map((actor) => (
                    <Card key={actor.id} className="bg-gray-900/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="aspect-square relative mb-3 overflow-hidden rounded-lg bg-gray-800">
                          {actor.profile_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                              alt={actor.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">No Photo</div>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm mb-1 line-clamp-1">{actor.name}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2">{actor.character}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies */}
            {movie.similar?.results && movie.similar.results.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Similar Movies</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movie.similar.results.slice(0, 6).map((similarMovie: any) => (
                    <MovieCard
                      key={similarMovie.id}
                      id={similarMovie.id}
                      title={similarMovie.title}
                      posterPath={similarMovie.poster_path}
                      rating={similarMovie.vote_average}
                      releaseDate={similarMovie.release_date}
                      mediaType="movie"
                      overview={similarMovie.overview}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Movie Info */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Release Date</h4>
                  <p className="text-gray-300">
                    {new Date(movie.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {movie.runtime && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Runtime</h4>
                    <p className="text-gray-300">{formatRuntime(movie.runtime)}</p>
                  </div>
                )}

                {director && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Director</h4>
                    <p className="text-gray-300">{director.name}</p>
                  </div>
                )}

                <Separator className="bg-gray-700" />

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">TMDB Rating</h4>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400">/10</span>
                  </div>
                </div>

                {omdbData && omdbData.imdbRating && omdbData.imdbRating !== "N/A" && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">IMDB Rating</h4>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold">{omdbData.imdbRating}</span>
                      <span className="text-gray-400">/10</span>
                    </div>
                  </div>
                )}

                {omdbData && omdbData.Ratings && omdbData.Ratings.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Other Ratings</h4>
                    <div className="space-y-2">
                      {omdbData.Ratings.map((rating: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-400 text-sm">{rating.Source}</span>
                          <span className="text-gray-300 text-sm">{rating.Value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
