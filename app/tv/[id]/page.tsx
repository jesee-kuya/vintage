"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, Calendar, Tv, Play, Plus, Check, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MovieCard } from "@/components/movie-card"
import { tmdbApi } from "@/lib/api"
import { useWatchlist } from "@/hooks/use-watchlist"

interface TVDetails {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  first_air_date: string
  last_air_date: string
  number_of_seasons: number
  number_of_episodes: number
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
  created_by: { id: number; name: string }[]
  networks: { id: number; name: string; logo_path: string }[]
  status: string
}

export default function TVPage() {
  const params = useParams()
  const id = Number.parseInt(params.id as string)
  const [tvShow, setTvShow] = useState<TVDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()

  const inWatchlist = tvShow ? isInWatchlist(tvShow.id, "tv") : false

  useEffect(() => {
    const fetchTVDetails = async () => {
      try {
        const tvData = await tmdbApi.getTVDetails(id)
        setTvShow(tvData)
      } catch (error) {
        console.error("Error fetching TV show details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTVDetails()
  }, [id])

  const handleWatchlistToggle = () => {
    if (!tvShow) return

    if (inWatchlist) {
      removeFromWatchlist(tvShow.id, "tv")
    } else {
      addToWatchlist({
        id: tvShow.id,
        title: tvShow.name,
        poster_path: tvShow.poster_path,
        vote_average: tvShow.vote_average,
        release_date: tvShow.first_air_date,
        media_type: "tv",
        overview: tvShow.overview,
      })
    }
  }

  const getTrailer = () => {
    if (!tvShow?.videos?.results) return null
    return tvShow.videos.results.find((video) => video.type === "Trailer" && video.site === "YouTube")
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

  if (!tvShow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-2">TV Show Not Found</h2>
          <p className="text-gray-500">The TV show you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const trailer = getTrailer()
  const creator = tvShow.created_by?.[0]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
          alt={tvShow.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                TV Show
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-300">{tvShow.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {tvShow.name}
            </h1>

            <div className="flex items-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tv className="h-4 w-4" />
                <span>
                  {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? "s" : ""}
                </span>
              </div>
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
              <p className="text-gray-300 leading-relaxed">{tvShow.overview}</p>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {tvShow.genres?.map((genre) => (
                  <Badge key={genre.id} variant="outline" className="border-gray-600">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cast */}
            {tvShow.credits?.cast && tvShow.credits.cast.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tvShow.credits.cast.slice(0, 8).map((actor) => (
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

            {/* Similar TV Shows */}
            {tvShow.similar?.results && tvShow.similar.results.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Similar TV Shows</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {tvShow.similar.results.slice(0, 6).map((similarShow: any) => (
                    <MovieCard
                      key={similarShow.id}
                      id={similarShow.id}
                      title={similarShow.name}
                      posterPath={similarShow.poster_path}
                      rating={similarShow.vote_average}
                      releaseDate={similarShow.first_air_date}
                      mediaType="tv"
                      overview={similarShow.overview}
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
                src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                alt={tvShow.name}
                fill
                className="object-cover"
              />
            </div>

            {/* TV Show Info */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">First Air Date</h4>
                  <p className="text-gray-300">
                    {new Date(tvShow.first_air_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Status</h4>
                  <p className="text-gray-300">{tvShow.status}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Seasons</h4>
                  <p className="text-gray-300">{tvShow.number_of_seasons}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Episodes</h4>
                  <p className="text-gray-300">{tvShow.number_of_episodes}</p>
                </div>

                {creator && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Created By</h4>
                    <p className="text-gray-300">{creator.name}</p>
                  </div>
                )}

                <Separator className="bg-gray-700" />

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">TMDB Rating</h4>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{tvShow.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400">/10</span>
                  </div>
                </div>

                {tvShow.networks && tvShow.networks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Networks</h4>
                    <div className="space-y-1">
                      {tvShow.networks.map((network) => (
                        <p key={network.id} className="text-gray-300 text-sm">
                          {network.name}
                        </p>
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
