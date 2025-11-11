import React, { useRef, useState } from "react";
import Card from "./Card";
import styled from "styled-components";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default React.memo(function CardSlider({ data, title, showAlert }) {
  const [showControls, setShowControls] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);

  const listRef = useRef();

  const handleDirection = (direction) => {
    let distance = listRef.current.getBoundingClientRect().x - 70;
    if (direction === "left" && sliderPosition > 0) {
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
      setSliderPosition(sliderPosition - 1);
    }
    if (direction === "right" && sliderPosition < 4) {
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
      setSliderPosition(sliderPosition + 1);
    }
  };

  return (
    <Container
      className="flex flex-col gap-4 relative py-8"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[34px] ml-4 sm:ml-8 md:ml-12">
        {title}
      </h1>
      <div>
        <div
          className={`absolute z-[99] h-full top-6 bottom-0 w-8 sm:w-10 md:w-12 transition duration-[0.3s] ease-in-out left-0 ${!showControls ? "none" : ""
            } flex items-center justify-center cursor-pointer`}
        >
          <AiOutlineLeft
            className="text-xl sm:text-2xl md:text-3xl"
            onClick={() => handleDirection("left")}
          />
        </div>
        <div
          className="flex w-max gap-2 sm:gap-4 translate-x-0 transition duration-[0.3s] ease-in-out ml-4 sm:ml-8 md:ml-12 mr-2 sm:mr-3"
          ref={listRef}
        >
          {data.map((movie, index) => {
            return (
              <Card
                movieData={movie}
                index={index}
                key={movie.id}
                showAlert={showAlert}
              />
            );
          })}
        </div>
        <div
          className={`absolute z-[99] h-full top-6 bottom-0 w-8 sm:w-10 md:w-12 transition duration-[0.3s] ease-in-out right-0 ${!showControls ? "none" : ""
            } flex items-center justify-center cursor-pointer`}
        >
          <AiOutlineRight
            className="text-xl sm:text-2xl md:text-3xl"
            onClick={() => handleDirection("right")}
          />
        </div>
      </div>
    </Container>
  );
});

const Container = styled.div`
  .none {
    display: none;
  }
`;
