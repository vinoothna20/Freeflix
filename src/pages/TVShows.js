import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, getGenres } from "../store";
import { firebaseAuth } from "../utils/firebase-config";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import NotAvailable from "../components/NotAvailable";
import { onAuthStateChanged } from "firebase/auth";
import SelectGenres from "../components/SelectGenres";
import Loader from "../components/Loader";

export default function TVShows() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [movieAdded, setMovieAdded] = useState(null);

  const dispatch = useDispatch();

  const { genresLoaded, movies, genres, loading } = useSelector(
    (state) => state.freeflix
  );

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]); // add dispatch as dependency

  useEffect(() => {
    if (genresLoaded) dispatch(fetchMovies({ type: "tv" }));
  }, [genresLoaded, dispatch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      // Example: redirect if not logged in
      // if (!currentUser) navigate("/login");
    });

    return () => unsubscribe(); // cleanup listener
  }, []); // include navigate if used inside

  const showAlert = (message) => {
    setMovieAdded(message);
    setTimeout(() => {
      setMovieAdded(null);
    }, 3000);
  };

  return (
    <div>
      <div>
        <Navbar isScrolled={isScrolled} movies={movies} />
      </div>
      <div className="mt-32">
        <SelectGenres genres={genres} type="tv" />
        {loading ? (
          <Loader /> //  show loader
        ) : movies.length ? (
          <div className="pb-14">
            <Slider movies={movies} showAlert={showAlert} />
          </div>
        ) : (
          <NotAvailable className="text-center text-white mt-16" />
        )}
      </div>
      {movieAdded && (
        <div className="fixed bottom-5 left-5 bg-green-500 text-white p-4 rounded">
          {movieAdded}
        </div>
      )}
    </div>
  );
}
