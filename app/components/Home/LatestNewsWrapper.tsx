import { LatestNews } from "./LatestNews";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function getLatestNews() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error("Failed to fetch latest news");

  return res.json();
}

export const LatestNewsWrapper = async () => {
  const data = await getLatestNews();
  const movie = data.results[0];

  return <LatestNews movie={movie} />;
};
