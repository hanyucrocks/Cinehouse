"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const LatestNewsSkeleton = () => {
  return (
    <>
      <div className="section-heading border-b-grey text-sh-grey mb-3 flex justify-between border-b border-solid text-sm">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-600" />
        <div className="h-3 w-10 animate-pulse rounded bg-gray-600" />
      </div>

      <div className="mb-9 flex flex-col pb-9 md:flex-row">
        <div className="h-[174px] w-full animate-pulse rounded bg-gray-700 md:w-[32%]" />

        <div className="bg-c-blue md:p-4 flex-1">
          <div className="mt-2 pl-3">
            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-600" />
          </div>

          <div className="my-2 pl-3 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-gray-600" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-gray-600" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-gray-600" />
          </div>
        </div>
      </div>
    </>
  );
};


export const LatestNews = () => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchLatestNews() {
      try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
      );

      if (!res.ok) return;

      const data = await res.json();
      setMovie(data.results[0]);
    } finally{
      setLoading(false);
    }
  }
    fetchLatestNews();
  }, []);
  if(loading) return <LatestNewsSkeleton />;
  if (!movie) return null;

  return (
    <>
      <div className="section-heading border-b-grey text-sh-grey mb-3 flex justify-between border-b border-solid text-sm">
        <p className="hover:text-hov-blue text-sm hover:cursor-pointer">
          LATEST NEWS
        </p>
        <p className="hover:text-hov-blue text-[11px] hover:cursor-pointer">
          MORE
        </p>
      </div>

      <div className="mb-9 flex flex-col pb-9 md:flex-row">
        <Image
          src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
          width={310}
          height={174}
          alt={movie.title}
          className="w-full rounded md:w-[32%]"
        />

        <div className="bg-c-blue md:p-4">
          <h1 className="text-p-white hover:text-hov-blue mt-2 pl-3 text-xl font-bold tracking-wider">
            {movie.title}
          </h1>

          <p className="text-sh-grey my-1.5 pl-3">
            {movie.overview.slice(0, 160)}…
            <Link
              href={`/film/${movie.id}`}
              className="text-p-white hover:text-hov-blue text-[11px] font-bold"
            >
              {" "}
              READ MORE
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
