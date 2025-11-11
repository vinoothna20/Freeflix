import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchDataByGenre } from "../store";

export default function SelectGenres({ genres, type }) {
  const dispatch = useDispatch();

  return (
    <Select
      className="flex ml-6 md:ml-20"
      onChange={(e) => {
        dispatch(fetchDataByGenre({ genre: e.target.value, type }));
      }}
    >
      {genres.map((genre) => {
        return (
          <option value={genre.id} key={genre.id}>
            {genre.name}
          </option>
        );
      })}
    </Select>
  );
}

const Select = styled.select`
  cursor: pointer;
  font-size: 1.3rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 1px solid;
`;
