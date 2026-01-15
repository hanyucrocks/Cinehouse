const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchLatestCinemaNews() {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 3600 } } // ISR: refresh every hour
  );

  if (!res.ok) throw new Error("Failed to fetch latest cinema news");

  return res.json();
}

// trying for some news.....
