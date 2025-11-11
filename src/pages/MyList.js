import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, firebaseAuth } from "../utils/firebase-config";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Card from "../components/Card";

export default function MyList() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState(undefined);
  const [storedMovies, setStoredMovies] = useState([]);
  const [movieRemoved, setMovieRemoved] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
      } else navigate("/login");
    });

    return () => unsubscribe(); // cleanup listener
  }, [navigate]); // add navigate as dependency

  useEffect(() => {
    async function fetchStoredMovies() {
      if (email) {
        const docSnap = await getDoc(doc(db, `users/${email}`));
        if (docSnap.exists()) {
          const movies = docSnap.data().savedMovies || [];
          setStoredMovies(movies); // Update the stored movies
        } else {
          console.log("No such document");
        }
      }
    }
    fetchStoredMovies();
  }, [email, movieRemoved]); // Re-run when movieRemoved changes (movie is removed)

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
          My list
        </h1>
        {storedMovies.length !== 0 ? (
          <div className="flex flex-wrap md:gap-x-20 lg:gap-x-16 gap-y-6 md:gap-y-8 lg:gap-y-12 ml-10 md:ml-16 lg:ml-10 xl:ml-0 ">
            {storedMovies.map((movie, index) => {
              return (
                <Card
                  movieData={movie}
                  index={index}
                  key={movie.id}
                  isLiked={true}
                  storedMovies={storedMovies}
                  setStoredMovies={setStoredMovies}
                  showAlert={showAlert}
                />
              );
            })}
          </div>
        ) : (
          // className="flex justify-center text-[22px] text-[#fa1f13]"
          <h2
            className="flex justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#fa1f13] font-cursive"
            style={{ fontFamily: "cursive" }}
          >
            Your list is empty :(
          </h2>
        )}
        {movieRemoved && (
          <div className="fixed bottom-5 left-0 md:left-5 bg-red-500 text-white p-4 rounded">
            {movieRemoved}
          </div>
        )}
      </div>
    </div>
  );
}
