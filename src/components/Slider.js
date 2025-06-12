import React from "react";
import CardSlider from "./CardSlider";

export default React.memo(function Slider({ movies, showAlert }) {
  const getMoviesFromRange = (from, to) => {
    return movies.slice(from, to);
  };

  // console.log(movies);
  return (
    <div>
      <CardSlider
        title="Trending Now"
        data={getMoviesFromRange(0, 10)}
        showAlert={showAlert}
      />
      <CardSlider
        title="New Releases"
        data={getMoviesFromRange(10, 20)}
        showAlert={showAlert}
      />
      <CardSlider
        title="Blockbuster Movies"
        data={getMoviesFromRange(20, 30)}
        showAlert={showAlert}
      />
      <CardSlider
        title="Popular On Freeflix"
        data={getMoviesFromRange(30, 40)}
        showAlert={showAlert}
      />
      <CardSlider
        title="Action Movies"
        data={getMoviesFromRange(40, 50)}
        showAlert={showAlert}
      />
      <CardSlider
        title="Epics"
        data={getMoviesFromRange(50, 60)}
        showAlert={showAlert}
      />
    </div>
  );
});
