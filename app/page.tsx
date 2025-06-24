import { HeroSection } from "@/components/hero-section"
import { TrendingSection } from "@/components/trending-section"
import { GenreSection } from "@/components/genre-section"
import { SearchSection } from "@/components/search-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SearchSection />
      <TrendingSection />
      <GenreSection />
    </div>
  )
}
