import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
import axios from "axios";

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
};

export const getGenres = createAsyncThunk("freeflix/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return genres;
});

const createArrayFromRawData = async (array, genres) => {
  const moviesArray = [];
  for (const movie of array) {
    const movieGenres = movie.genre_ids
      .map((genre) => {
        const genreObj = genres.find(({ id }) => id === genre);
        return genreObj ? genreObj.name : null;
      })
      .filter(Boolean);

    if (movie.backdrop_path) {
      try {
        const videoResponse = await axios.get(
          `${TMDB_BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
        );
        const videos = videoResponse.data.results;
        const trailer = videos.find((video) => video.type === "Trailer");

        moviesArray.push({
          id: movie.id,
          name: movie?.original_name
            ? movie.original_name
            : movie.original_title,
          image: movie.backdrop_path,
          genres: movieGenres.slice(0, 3),
          videoUrl: trailer
            ? `https://www.youtube.com/embed/${trailer.key}`
            : "",
        });
      } catch (error) {
        console.error(
          `Failed to fetch videos for movie ID ${movie.id}:`,
          error
        );
        moviesArray.push({
          id: movie.id,
          name: movie?.original_name
            ? movie.original_name
            : movie.original_title,
          image: movie.backdrop_path,
          genres: movieGenres.slice(0, 3),
          videoUrl: "",
        });
      }
    }
  }
  return moviesArray;
};

const getRawData = async (api, genres, paging) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    try {
      const {
        data: { results },
      } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
      const newMovies = await createArrayFromRawData(results, genres);
      moviesArray.push(...newMovies);
    } catch (error) {
      console.error(`Failed to fetch data from API:`, error);
    }
  }
  // console.log({ moviesArray });
  return moviesArray;
};

export const fetchMovies = createAsyncThunk(
  "freeflix/trending",
  async ({ type }, thunkApi) => {
    const {
      freeflix: { genres },
    } = thunkApi.getState();
    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );
  }
);

export const fetchDataByGenre = createAsyncThunk(
  "freeflix/moviesByGenres",
  async ({ genre, type }, thunkApi) => {
    const {
      freeflix: { genres },
    } = thunkApi.getState();
    return getRawData(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
      genres
    );
    // console.log(data);
  }
);

const FreeflixSlice = createSlice({
  name: "freeflix",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    freeflix: FreeflixSlice.reducer,
  },
});
