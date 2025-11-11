import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import video from "../assets/stranger_things_video.mp4";
import { IoPlayCircleSharp } from "react-icons/io5";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, firebaseAuth } from "../utils/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

export default React.memo(function Card({
  movieData,
  isLiked = false,
  storedMovies,
  setStoredMovies,
  showAlert,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, [navigate]); // <-- Add navigate as dependency

  const movieId = doc(db, `users/${email}`);

  const addToList = async () => {
    if (email) {
      await updateDoc(movieId, {
        savedMovies: arrayUnion({
          id: movieData.id,
          name: movieData.name,
          image: `https://image.tmdb.org/t/p/w500${movieData.image}`,
          videoUrl: movieData.videoUrl,
        }),
      });
      showAlert(`${movieData.name} has been added to your list!`);
    } else {
      console.log("error");
    }
  };

  const removeFromList = async (passedId) => {
    try {
      const result = storedMovies.filter((item) => item.id !== passedId);

      // Update the database first
      await updateDoc(movieId, {
        savedMovies: result,
      });

      // Update the state after removing the movie
      setStoredMovies(result);

      showAlert(`${movieData.name} has been removed from your list!`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container
      className="h-full cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className="w-full h-full z-10  rounded"
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="movie"
      />
      {isHovered && (
        <div className="hover z-[50] h-max w-64 sm:w-72 md:w-80 lg:w-96 absolute top-[-18vh] left-0 rounded-md bg-[#181818] transition duration-[0.3s] ease-in-out">
          <div className="relative h-32 sm:h-36 md:h-40 lg:h-48">
            <img
              className="w-full h-full object-cover rounded top-0 z-[4] absolute"
              src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
              alt="movie"
              onClick={() => navigate("/player", { state: { movieData } })}
            />
            {movieData.videoUrl ? (
              <iframe
                className="w-full h-full object-cover rounded top-0 z-[5] absolute"
                src={movieData.videoUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onClick={() => navigate("/player", { state: { movieData } })}
              ></iframe>
            ) : (
              <img
                className="w-full h-full object-cover rounded top-0 z-[4] absolute"
                src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
                alt="movie"
                onClick={() => navigate("/player", { state: { movieData } })}
              />
            )}
          </div>
          <div className="p-2 sm:p-4 flex flex-col gap-1 sm:gap-2 z-[90]">
            <h3
              className="text-sm sm:text-md md:text-lg lg:text-xl"
              onClick={() => navigate("/player", { state: { movieData } })}
            >
              {movieData.name}
            </h3>
            <div className="icons flex justify-between">
              <div className="flex gap-2 sm:gap-4">
                <IoPlayCircleSharp
                  title="Play"
                  onClick={() => navigate("/player", { state: { movieData } })}
                  className="text-sm sm:text-md md:text-lg lg:text-2xl"
                />
                <RiThumbUpFill
                  title="Like"
                  className="text-sm sm:text-md md:text-lg lg:text-2xl"
                />
                <RiThumbDownFill
                  title="Dislike"
                  className="text-sm sm:text-md md:text-lg lg:text-2xl"
                />
                {isLiked ? (
                  <BsCheck
                    title="Remove from list"
                    onClick={() => removeFromList(movieData.id)}
                    className="text-sm sm:text-md md:text-lg lg:text-2xl"
                  />
                ) : (
                  <AiOutlinePlus
                    title="Add to my list"
                    onClick={addToList}
                    className="text-sm sm:text-md md:text-lg lg:text-2xl"
                  />
                )}
              </div>
              <div className="info">
                <BiChevronDown
                  title="More info"
                  className="text-sm sm:text-md md:text-lg lg:text-2xl"
                />
              </div>
            </div>
            <div>
              <ul className="flex gap-2 sm:gap-4">
                {movieData.genres?.map((genre) => {
                  return (
                    <li
                      key={genre}
                      className="text-xs sm:text-sm md:text-md lg:text-lg"
                    >
                      {genre}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
});

const Container = styled.div`
  max-width: 230px;
  width: 230px;
  .hover {
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    .icons {
      svg {
        font-size: 2rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: #b8b8b8;
        }
      }
    }
    .genres {
      ul {
        li {
          padding-right: 0.7rem;
        }
      }
    }
  }
`;
