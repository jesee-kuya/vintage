"use client"

import { useWatchlist } from "@/hooks/use-watchlist"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Bookmark, Trash2 } from "lucide-react"

export default function WatchlistPage() {
  const { watchlist, clearWatchlist } = useWatchlist()

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bookmark className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">Your Watchlist is Empty</h2>
          <p className="text-gray-500">Start adding movies and TV shows to keep track of what you want to watch</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Bookmark className="h-6 w-6 text-amber-500" />
            <h1 className="text-3xl font-bold">My Watchlist</h1>
            <span className="text-gray-400">({watchlist.length} items)</span>
          </div>

          <Button
            variant="outline"
            onClick={clearWatchlist}
            className="flex items-center space-x-2 text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchlist.map((item) => (
            <MovieCard
              key={`${item.id}-${item.media_type}`}
              id={item.id}
              title={item.title}
              posterPath={item.poster_path}
              rating={item.vote_average}
              releaseDate={item.release_date}
              mediaType={item.media_type}
              overview={item.overview}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
