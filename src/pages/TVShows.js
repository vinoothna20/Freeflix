import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMovies, getGenres } from "../store";
import { firebaseAuth } from "../utils/firebase-config";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import NotAvailable from "../components/NotAvailable";
import { onAuthStateChanged } from "firebase/auth";
import SelectGenres from "../components/SelectGenres";

export default function TVShows() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [movieAdded, setMovieAdded] = useState(null);
  const navigate = useNavigate();
  const genresLoaded = useSelector((state) => state.freeflix.genresLoaded);
  const movies = useSelector((state) => state.freeflix.movies);
  const genres = useSelector((state) => state.freeflix.genres);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) dispatch(fetchMovies({ type: "tv" }));
  }, [genresLoaded]);

  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    // if (currentUser) navigate("/");
  });

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
        {movies.length ? (
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
