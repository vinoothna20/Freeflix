import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { BsArrowLeft } from "react-icons/bs";

export default function SearchedList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchResults } = location.state || [];

  return (
    <div>
      <div className="bg-black p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="flex gap-6 mb-10 items-center">
          <div className="">
            <BsArrowLeft
              className="cursor-pointer text-2xl md:text-5xl"
              onClick={() => navigate(-1)}
            />
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl ">
            Search Results
          </div>
        </div>

        {searchResults.length > 0 ? (
          <div className="flex flex-wrap md:gap-x-20 lg:gap-x-16 gap-y-6 md:gap-y-8 lg:gap-y-12 ml-8 md:ml-16 lg:ml-10 xl:ml-0">
            {searchResults.map((movie, index) => (
              <Card movieData={movie} index={index} key={movie.id} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[60vh]">
            <h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#fa1f13] text-center"
              style={{ fontFamily: "cursive" }}
            >
              😕🎬 No movies found… Time to discover something new! 🌟🍿
            </h2>
          </div>
        )}

      </div>
    </div>
  );
}
