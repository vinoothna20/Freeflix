import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { firebaseAuth, db } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [alertMessage, setAlertMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) navigate("/");
    });

    return () => unsubscribe(); // cleanup listener
  }, [navigate]); // add navigate as dependency

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleSignup = async () => {
    try {
      const { email, password } = formValues;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      setDoc(doc(db, `users/${email}`), {
        savedMovies: [],
      });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setAlertMessage("User already has an account.");
      } else if (error.code === "auth/weak-password") {
        setAlertMessage(
          "Password is too weak. Please choose a stronger password."
        );
      } else {
        setAlertMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container showPassword={showPassword}>
      <BackgroundImage />
      <div className="content absolute top-0 left-0 h-screen w-screen grid">
        <Header login />
        <div className="body flex flex-col items-center justify-center gap-4 px-0 md:px-4 lg:px-16 ">
          <div className="flex flex-col gap-4 text-center text-[2rem]">
            <h1 className="text-[1.4rem] md:text-[2rem] xl:text-[38px] font-bold py-0 px-4 md:px-0 xl:px-[26rem]">
              Unlimited movies, TV shows and more...
            </h1>
            <h1 className="text-[1.4rem] md:text-[2rem] xl:text-[32px] py-0 px-4 md:px-0 font-bold">
              Watch anywhere. Cancel anytime.
            </h1>
            <h6 className="text-sm md:text-base lg:text-lg font-bold">
              Ready to watch? Enter your email to create or restart membership
            </h6>
          </div>
          <div className="form grid md:w-3/5 ">
            <input
              className="text-black p-4 md:p-6 text-base md:text-xl border border-solid border-black focus:outline-none"
              type="mail"
              placeholder="Email Address"
              name="email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value,
                })
              }
            />
            {showPassword && (
              <input
                className="text-black p-4 md:p-6 text-base md:text-xl border border-solid border-black focus:outline-none"
                type="password"
                placeholder="Password"
                name="password"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            )}
            {!showPassword && (
              <button
                className="py-2 px-4 bg-[#e50914] font-bold text-base md:text-[1.05rem]"
                onClick={() => setShowPassword(true)}
              >
                Get Started
              </button>
            )}
          </div>
          <button
            className="py-2 px-4 bg-[#e50914] font-bold text-base md:text-[1.05rem] rounded"
            onClick={handleSignup}
          >
            Sign Up
          </button>
          {alertMessage && (
            <div className="fixed bottom-5 left-5 right-5 md:right-auto bg-red-500 text-white p-4 rounded-md text-sm md:text-base lg:text-lg shadow-md">
              {alertMessage}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  .content {
    background-color: rgba(0, 0, 0, 0.5);
    grid-template-rows: 15vh 85vh;
    .body {
      .form {
        grid-template-columns: ${({ showPassword }) =>
    showPassword ? "1fr 1fr" : "2fr 1fr"};
        @media (max-width: 426px) {
          grid-template-columns: none;
        }
      }
    }
  }
`;
