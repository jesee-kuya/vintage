"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface WatchlistItem {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  media_type: string
  overview: string
  added_at: string
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem("vintage-watchlist")
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading watchlist:", error)
      }
    }
  }, [])

  const saveToStorage = (items: WatchlistItem[]) => {
    localStorage.setItem("vintage-watchlist", JSON.stringify(items))
  }

  const addToWatchlist = (item: Omit<WatchlistItem, "added_at">) => {
    const newItem: WatchlistItem = {
      ...item,
      added_at: new Date().toISOString(),
    }

    const updatedWatchlist = [...watchlist, newItem]
    setWatchlist(updatedWatchlist)
    saveToStorage(updatedWatchlist)

    toast({
      title: "Added to Watchlist",
      description: `${item.title} has been added to your watchlist.`,
    })
  }

  const removeFromWatchlist = (id: number, mediaType: string) => {
    const updatedWatchlist = watchlist.filter((item) => !(item.id === id && item.media_type === mediaType))
    setWatchlist(updatedWatchlist)
    saveToStorage(updatedWatchlist)

    const item = watchlist.find((item) => item.id === id && item.media_type === mediaType)
    toast({
      title: "Removed from Watchlist",
      description: `${item?.title} has been removed from your watchlist.`,
    })
  }

  const isInWatchlist = (id: number, mediaType: string) => {
    return watchlist.some((item) => item.id === id && item.media_type === mediaType)
  }

  const clearWatchlist = () => {
    setWatchlist([])
    saveToStorage([])
    toast({
      title: "Watchlist Cleared",
      description: "All items have been removed from your watchlist.",
    })
  }

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    clearWatchlist,
  }
}
