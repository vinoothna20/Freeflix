import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Header(props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-0 px-3 sm:px-5 md:px-16">
      <div className="logo">
        <img className="h-12 sm:h-20 md:h-24" src={logo} alt="logo" />
      </div>
      <button
        className="py-2 px-4 bg-[#e50914] cursor-pointer text-sm sm:text-md md:text-[1.05rem] font-bold rounded"
        onClick={() => navigate(props.login ? "/login" : "/signup")}
      >
        {props.login ? "Log In" : "Sign In"}
      </button>
    </div>
  );
}
