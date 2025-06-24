"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SearchFiltersProps {
  filters: {
    type: string
    genre: string
    year: string
    rating: string
  }
  onFiltersChange: (filters: any) => void
  className?: string
}

const genres = [
  { id: "", name: "All Genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "10770", name: "TV Movie" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
]

const years = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() - i
  return { value: year.toString(), label: year.toString() }
})

export function SearchFilters({ filters, onFiltersChange, className }: SearchFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <Card className={cn("bg-gray-900/50 border-gray-700", className)}>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Type</label>
            <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
                <SelectItem value="person">People</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Genre</label>
            <Select value={filters.genre} onValueChange={(value) => updateFilter("genre", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Year</label>
            <Select value={filters.year} onValueChange={(value) => updateFilter("year", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="Any Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Year</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Rating</label>
            <Select value={filters.rating} onValueChange={(value) => updateFilter("rating", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Rating</SelectItem>
                <SelectItem value="9">9+ Excellent</SelectItem>
                <SelectItem value="8">8+ Very Good</SelectItem>
                <SelectItem value="7">7+ Good</SelectItem>
                <SelectItem value="6">6+ Above Average</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
