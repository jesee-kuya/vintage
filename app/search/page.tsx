"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MovieCard } from "@/components/movie-card"
import { SearchFilters } from "@/components/search-filters"
import { Pagination } from "@/components/pagination"
import { tmdbApi } from "@/lib/api"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchResult {
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

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    genre: "",
    year: "",
    rating: "",
  })

  useEffect(() => {
    if (query) {
      searchContent(query, currentPage)
    }
  }, [query, currentPage, filters])

  const searchContent = async (searchQuery: string, page: number) => {
    setLoading(true)
    try {
      const data = await tmdbApi.searchMulti(searchQuery, page)
      setResults(data.results || [])
      setTotalPages(Math.min(data.total_pages || 0, 500)) // TMDB limits to 500 pages
    } catch (error) {
      console.error("Error searching content:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">Start Searching</h2>
          <p className="text-gray-500">Enter a movie or TV show title to begin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-gray-400">{loading ? "Searching..." : `Found results for "${query}"`}</p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        {showFilters && <SearchFilters filters={filters} onFiltersChange={setFilters} className="mb-8" />}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {results.map((item) => (
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
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No Results Found</h2>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
