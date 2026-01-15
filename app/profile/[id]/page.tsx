"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "app/firebase/firebase";

import { LayoutNavbar } from "app/components/Navigation/LayoutNavbar";
import { Footer } from "app/components/Navigation/Footer";

import { ProfileBio } from "app/components/Profile/ProfileBio";
import { ProfileMoviesHighlight } from "app/components/Profile/ProfileMoviesHighlight";
import { ProfileReviews } from "app/components/Profile/ProfileReviews";

import {
  User,
  UserFavourite,
  UserReview,
  UserWatched,
} from "app/types";

export default function Page({ params }: any) {
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);

  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [favourites, setFavourites] = useState<UserFavourite[]>([]);
  const [watched, setWatched] = useState<UserWatched[]>([]);

  const router = useRouter();

  // Fetch profile data
  const initProfilePage = async () => {
    try {
      setLoading(true);

      const userSnap = await getDoc(doc(db, "users", id));

      if (!userSnap.exists()) {
        setUser(null);
        return;
      }

      const userData = userSnap.data() as User;
      setUser(userData);

      setReviews(
        (userData.reviews ?? []).slice().reverse().slice(0, 6)
      );
      setWatched(userData.watched ?? []);
      setFavourites(userData.favourites ?? []);
    } catch (error) {
      console.error("Error loading profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh movies after profile events
  const refreshMovies = async () => {
    const userSnap = await getDoc(doc(db, "users", id));
    if (!userSnap.exists()) return;

    const userData = userSnap.data() as User;
    setWatched(userData.watched ?? []);
    setFavourites(userData.favourites ?? []);
  };

  const onEvent = () => {
    refreshMovies();
  };

  useEffect(() => {
    initProfilePage();
  }, [id]);

  // Determine author AFTER profile loads
  useEffect(() => {
    if (!user) return;
    setIsAuthor(auth.currentUser?.uid === user.uid);
  }, [user]);

  // ----- RENDER STATES -----

  if (loading) {
    return (
      <>
        <LayoutNavbar />
        <div className="min-h-[78vh] flex items-center justify-center text-white">
          Loading profile…
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <LayoutNavbar />
        <div className="min-h-[78vh] flex items-center justify-center text-white">
          User not found.
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <LayoutNavbar />

      <div className="site-body min-h-[78vh] py-5">
        <div className="flex flex-col px-4 font-['Graphik'] md:mx-auto md:w-[950px] md:py-8">
          <ProfileBio user={user} isAuthor={isAuthor} />

          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div>
              <ProfileMoviesHighlight
                user={user}
                movies={favourites}
                watched={watched}
                favourites={favourites}
                type="favourites"
                onEvent={onEvent}
              />

              <ProfileMoviesHighlight
                user={user}
                movies={watched}
                watched={watched}
                favourites={favourites}
                type="watched"
                onEvent={onEvent}
              />
            </div>

            <ProfileReviews reviews={reviews} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
