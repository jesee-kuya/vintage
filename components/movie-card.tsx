"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Plus, Check, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWatchlist } from "@/hooks/use-watchlist"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  id: number
  title: string
  posterPath: string
  rating: number
  releaseDate: string
  mediaType: string
  overview?: string
}

export function MovieCard({ id, title, posterPath, rating, releaseDate, mediaType, overview }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()

  const inWatchlist = isInWatchlist(id, mediaType)
  const year = releaseDate ? new Date(releaseDate).getFullYear() : ""
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "/placeholder.svg?height=750&width=500"

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWatchlist) {
      removeFromWatchlist(id, mediaType)
    } else {
      addToWatchlist({
        id,
        title,
        poster_path: posterPath,
        vote_average: rating,
        release_date: releaseDate,
        media_type: mediaType,
        overview: overview || "",
      })
    }
  }

  return (
    <div
      className="group relative cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/${mediaType}/${id}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
          <Image
            src={posterUrl || "/placeholder.svg"}
            alt={title}
            fill
            className={cn("object-cover transition-opacity duration-300", imageLoaded ? "opacity-100" : "opacity-0")}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          />

          {!imageLoaded && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}

          {/* Overlay on hover */}
          <div
            className={cn(
              "absolute inset-0 bg-black/60 transition-opacity duration-300 flex items-center justify-center",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <Play className="h-12 w-12 text-white" />
          </div>

          {/* Rating badge */}
          {rating > 0 && (
            <Badge className="absolute top-2 left-2 bg-black/70 text-white border-0">
              <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
              {rating.toFixed(1)}
            </Badge>
          )}

          {/* Watchlist button */}
          <Button
            size="sm"
            variant="secondary"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 p-0 bg-black/70 hover:bg-black/90 border-0 transition-all duration-300",
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90",
            )}
            onClick={handleWatchlistToggle}
          >
            {inWatchlist ? <Check className="h-4 w-4 text-green-400" /> : <Plus className="h-4 w-4 text-white" />}
          </Button>
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-amber-400 transition-colors">{title}</h3>
          {year && <p className="text-xs text-gray-400">{year}</p>}
        </div>
      </Link>
    </div>
  )
}
