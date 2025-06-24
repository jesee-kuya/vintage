# 🎬 Vintage

**Vintage** is a modern, responsive Movie & TV Show discovery web app that lets users search, explore, and manage their favorite entertainment content. Powered by TMDB and OMDB APIs, it offers a rich interface for discovering trending titles, browsing by genre, viewing detailed info, and curating a personal watchlist.

---

## Features

-  **Live Search**: Instantly search for movies and TV shows with real-time results and debouncing.
-  **Detailed Info Pages**: View plots, casts, ratings (IMDB, Rotten Tomatoes, TMDB), release dates, posters, and more.
-  **Watchlist Management**: Add/remove titles, mark as watched, and persist your list in local storage.
-  **Trending Dashboard**: Explore what's hot with popular and top-rated titles.
-  **Genre-Based Browsing**: Filter and discover content by genre and category.
-  **Multi-Source Ratings**: Integrates ratings and metadata from TMDB and OMDB.
-  **Smart Recommendations**: Get suggestions based on your watchlist preferences.
-  **Responsive UI**: Seamless experience across mobile, tablet, and desktop.

---

## ⚙️ Tech Stack

- **Frontend**: React / Next.js (Client-Side)
- **API**: [TMDB API](https://developer.themoviedb.org/) & [OMDB API](https://www.omdbapi.com/)
- **Storage**: `localStorage` for user preferences and watchlist

---

##  Key Implementation Details

- API response caching for performance boosts
- Graceful fallbacks for missing or incomplete data
- API error handling and loading skeletons
- Pagination support for all content lists
- API rate-limit handling
- Secure API key management via `.env.local`

---

##  Installation

1. **Clone the Repo**  
   ```bash
   git clone https://github.com/<your-username>/vintage.git
   cd vintage
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env.local` file in the root directory with the following:

   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
   NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key
   ```

4. **Run the App**

   ```bash
   npm run dev
   ```

5. Open your browser at [http://localhost:3000](http://localhost:3000)

---

##  Deployment

Vintage can be deployed on platforms like **Vercel**, **Netlify**, or any static hosting service that supports Next.js.

---

##  Development Notes

* Use `localStorage` for persisting user watchlists across sessions
* Handle API errors using `try/catch` blocks and display user-friendly messages
* Use `debounce` on search input to minimize API calls
* Normalize and validate data across TMDB and OMDB for consistency

---

##  Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

##  Author

**Jesee Kuya**
[GitHub](https://github.com/jesee-kuya) | [LinkedIn](www.linkedin.com/in/jeseekuya)

---

##  License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

##  Acknowledgments

* [TMDB](https://www.themoviedb.org/) for their incredible API
* [OMDB](http://www.omdbapi.com/) for supplementary movie data
* Icons by [Lucide](https://lucide.dev/)

