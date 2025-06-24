"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchSection() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 300)

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    },
    [router],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Next Favorite</h2>
        <p className="text-gray-400 mb-8 text-lg">Search through millions of movies and TV shows</p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search movies, TV shows, actors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-24 py-4 text-lg bg-gray-900/50 border-gray-700 focus:border-amber-500 focus:ring-amber-500/20"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            >
              Search
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
