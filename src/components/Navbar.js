import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaPowerOff, FaSearch, FaBars } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import _ from "lodash";

export default function Navbar({ isScrolled, movies }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [inputHover, setInputHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const links = [
    { name: "Home", link: "/" },
    { name: "TV Shows", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
  ];

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login");
    });
  }, [navigate]);

  const debouncedSearch = useMemo(
    () =>
      _.debounce((value) => {
        if (value) {
          const filteredData = movies.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
          );
          navigate("/search", { state: { searchResults: filteredData } });
        }
      }, 1200),
    [movies, navigate] // stable dependencies
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <Container>
      <nav
        className={`flex ${isScrolled ? "bg-black" : ""
          } fixed top-0 h-[4.5rem] sm:h-[6.5rem] w-full justify-between z-[2] py-2 px-4 sm:py-0 sm:px-16 items-center transition duration-[0.3s] ease-in-out`}
      >
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex items-center justify-center">
            <img className="h-8 sm:h-16 md:h-20" src={logo} alt="logo" />
          </div>
          <ul className="hidden lg:flex gap-4 sm:gap-8">
            {links.map(({ name, link }) => {
              return (
                <li key={name}>
                  <Link to={link}>{name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className={`${showSearch ? "show-search" : ""
              } flex gap-2 items-center justify-center p-1 pl-2`}
          >
            <button
              className="bg-transparent"
              onFocus={() => setShowSearch(true)}
              onBlur={() => {
                if (!inputHover) setShowSearch(false);
              }}
            >
              <FaSearch className="text-white" />
            </button>

            <input
              className="w-0 opacity-0 invisible transition duration-[0.3s] ease-in-out bg-transparent text-white focus:outline-none"
              type="text"
              placeholder="Search"
              onMouseEnter={() => setInputHover(true)}
              onMouseLeave={() => setInputHover(false)}
              onBlur={() => {
                setShowSearch(false);
                setInputHover(false);
              }}
              value={searchValue}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="bg-transparent cursor-pointer focus:outline-none"
            onClick={() => signOut(firebaseAuth)}
          >
            <FaPowerOff className="text-[#f34242] text-lg sm:text-xl" />
          </button>
          <button
            className="lg:hidden bg-transparent focus:outline-none"
            onClick={toggleMenu}
          >
            <FaBars className="text-white text-lg" />
          </button>
        </div>
        {showMenu && (
          <ul className="absolute top-[3.2rem] md:top-[4.5rem] right-5 md:right-16 w-4/12 md:w-3/12 bg-[#d00700c4] lg:hidden flex flex-col items-center gap-4 py-3 px-0">
            {links.map(({ name, link }) => (
              <li key={name}>
                <Link to={link} onClick={() => setShowMenu(false)}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </Container>
  );
}

const Container = styled.div`
  nav {
    .show-search {
      border: 1px solid white;
      background-color: rgba(0, 0, 0, 0.6);
      input {
        width: 100%;
        opacity: 1;
        visibility: visible;
        padding: 0.3rem;
      }
    }
  }
`;
