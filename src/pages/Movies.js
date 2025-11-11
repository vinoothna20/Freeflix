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
import Loader from "../components/Loader";

export default function Movies() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [movieAdded, setMovieAdded] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { genresLoaded, movies, genres, loading } = useSelector(
    (state) => state.freeflix
  );

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genresLoaded) dispatch(fetchMovies({ type: "movies" }));
  }, [genresLoaded, dispatch]);

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
      <div className="mt-24 md:mt-32">
        <SelectGenres genres={genres} type="movie" />
        {loading ? (
          <Loader /> // show loader while Redux says loading=true
        ) : movies.length ? (
          <div className="pb-14">
            <Slider movies={movies} showAlert={showAlert} />
          </div>
        ) : (
          <NotAvailable />
        )}
      </div>
      {movieAdded && (
        <div className="fixed bottom-5 md:left-5 bg-green-500 text-white p-4 rounded">
          {movieAdded}
        </div>
      )}
    </div>
  );
}
