"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Home, Bookmark, TrendingUp, Film } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-amber-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Vintage
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-gray-300 hover:text-white hover:bg-gray-800",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    pathname === item.href
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-gray-300 hover:text-white hover:bg-gray-800",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
