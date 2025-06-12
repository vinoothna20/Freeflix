import React from "react";
import background from "../assets/login.jpg";

export default function BackgroundImage() {
  return (
    <div className="h-screen w-screen">
      <img
        className="h-screen w-full object-cover"
        src={background}
        alt="background image"
      />
    </div>
  );
}
