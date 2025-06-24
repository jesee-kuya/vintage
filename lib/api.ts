const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const OMDB_BASE_URL = "https://www.omdbapi.com"

const TMDB_API_KEY =
  process.env.NEXT_PUBLIC_TMDB_API_KEY ||
  "158edbaf63d53e4ad7b56237b05d5776"
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || "420e5fdc"

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Rate limiting
const rateLimiter = {
  requests: 0,
  resetTime: Date.now() + 1000,

  canMakeRequest() {
    const now = Date.now()
    if (now > this.resetTime) {
      this.requests = 0
      this.resetTime = now + 1000
    }

    if (this.requests >= 40) {
      // TMDB allows 40 requests per second
      return false
    }

    this.requests++
    return true
  },
}

async function fetchWithCache(url: string, cacheKey: string) {
  // Check cache first
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  // Rate limiting
  if (!rateLimiter.canMakeRequest()) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Cache the response
    cache.set(cacheKey, { data, timestamp: Date.now() })

    return data
  } catch (error) {
    console.error("API fetch error:", error)
    throw error
  }
}

export const tmdbApi = {
  async getTrending(mediaType: "movie" | "tv" | "all", timeWindow: "day" | "week") {
    const url = `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}`
    const cacheKey = `trending-${mediaType}-${timeWindow}`
    return fetchWithCache(url, cacheKey)
  },

  async searchMulti(query: string, page = 1) {
    const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    const cacheKey = `search-${query}-${page}`
    return fetchWithCache(url, cacheKey)
  },

  async getMovieDetails(id: number) {
    const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar,reviews`
    const cacheKey = `movie-${id}`
    return fetchWithCache(url, cacheKey)
  },

  async getTVDetails(id: number) {
    const url = `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar,reviews`
    const cacheKey = `tv-${id}`
    return fetchWithCache(url, cacheKey)
  },

  async getMoviesByGenre(genreId: number, page = 1) {
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    const cacheKey = `genre-${genreId}-${page}`
    return fetchWithCache(url, cacheKey)
  },

  async getPopular(mediaType: "movie" | "tv", page = 1) {
    const url = `${TMDB_BASE_URL}/${mediaType}/popular?api_key=${TMDB_API_KEY}&page=${page}`
    const cacheKey = `popular-${mediaType}-${page}`
    return fetchWithCache(url, cacheKey)
  },

  async getGenres(mediaType: "movie" | "tv") {
    const url = `${TMDB_BASE_URL}/genre/${mediaType}/list?api_key=${TMDB_API_KEY}`
    const cacheKey = `genres-${mediaType}`
    return fetchWithCache(url, cacheKey)
  },
}

export const omdbApi = {
  async getDetails(imdbId: string) {
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`
    const cacheKey = `omdb-${imdbId}`
    return fetchWithCache(url, cacheKey)
  },

  async searchByTitle(title: string, year?: string) {
    const yearParam = year ? `&y=${year}` : ""
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}${yearParam}&plot=full`
    const cacheKey = `omdb-search-${title}-${year || "any"}`
    return fetchWithCache(url, cacheKey)
  },
}
