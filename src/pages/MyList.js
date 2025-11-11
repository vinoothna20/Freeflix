import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, firebaseAuth } from "../utils/firebase-config";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Card from "../components/Card";
import Loader from "../components/Loader";

export default function MyList() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState(undefined);
  const [storedMovies, setStoredMovies] = useState([]);
  const [movieRemoved, setMovieRemoved] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
      } else navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch stored movies
  useEffect(() => {
    async function fetchStoredMovies() {
      if (email) {
        setLoading(true);
        const docSnap = await getDoc(doc(db, `users/${email}`));
        if (docSnap.exists()) {
          const movies = docSnap.data().savedMovies || [];
          setStoredMovies(movies);
        } else {
          console.log("No such document");
        }
        setLoading(false);
      }
    }
    fetchStoredMovies();
  }, [email, movieRemoved]);

  const showAlert = (message) => {
    setMovieRemoved(message);
    setTimeout(() => {
      setMovieRemoved(null);
    }, 3000);
  };

  return (
    <div>
      <Navbar isScrolled={isScrolled} />
      <div className="m-4 sm:m-6 md:m-8 lg:m-12 mt-24 sm:mt-28 md:mt-32 lg:mt-36 flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 z-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl ml-4 sm:ml-6 md:ml-8 lg:ml-12">
          My List 🎬✨
        </h1>

        {loading ? (
          <Loader message="Fetching your wish list... 🍿✨" />
        ) : storedMovies.length !== 0 ? (
          <div className="flex flex-wrap md:gap-x-20 lg:gap-x-16 gap-y-6 md:gap-y-8 lg:gap-y-12 ml-10 md:ml-16 lg:ml-10 xl:ml-0">
            {storedMovies.map((movie, index) => (
              <Card
                movieData={movie}
                index={index}
                key={movie.id}
                isLiked={true}
                storedMovies={storedMovies}
                setStoredMovies={setStoredMovies}
                showAlert={showAlert}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#fa1f13] font-bold">
              Your cinematic adventure awaits! 🎥✨
            </h2>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl text-white">
              Start adding movies to your list and let's make movie magic! 🍿💫
            </p>
          </div>
        )}

        {movieRemoved && (
          <div className="fixed bottom-5 left-0 md:left-5 bg-red-500 text-white p-4 rounded shadow-lg">
            {movieRemoved}
          </div>
        )}
      </div>
    </div>
  );
}
