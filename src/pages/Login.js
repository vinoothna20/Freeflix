import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  console.log(loginError);

  const handleLogin = async () => {
    try {
      const { email, password } = formValues;
      setLoginError(false);
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      setLoginError(true);
    }
  };

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) navigate("/");
    });
  }, []);

  return (
    <Container className="relative">
      <BackgroundImage />
      <div className="content absolute top-0 left-0 h-screen w-screen grid ">
        <Header />
        <div className="form-container flex flex-col items-center justify-center gap-8 h-[85vh]">
          {loginError && (
            <div
              className="flex items-center p-4 mb-4 text-sm rounded-lg bg-red-500 text-white"
              role="alert"
            >
              <svg
                className="flex-shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Alert!</span> You have entered the
                wrong credentials. Please try again.
              </div>
            </div>
          )}
          <div className="flex flex-col items-center justify-center p-4 md:p-8 w-full md:w-1/2 lg:w-[35vw] xl:w-[25vw] gap-8 bg-[#000000b0] ">
            <div>
              <h3 className="text-lg md:text-xl">Login</h3>
            </div>
            <div className="flex flex-col gap-4 md:gap-8 align-middle">
              <input
                className="w-60 py-2 px-4 text-black text-sm md:text-base"
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
              <input
                className="w-60 py-2 px-4 text-black text-sm md:text-base"
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

              <div className="bg-red-600 rounded-sm">
                <details className="w-60">
                  <summary className="text-base md:text-base pl-2 cursor-pointer">
                    Save your time using these credentials 😉
                  </summary>
                  <p className="bg-red-500 pl-2 mt-2 py-2 rounded-sm">
                    <span className="font-bold">Username:</span> demo@gmail.com
                    <br />
                    <span className="font-bold"> Password:</span> demo123
                  </p>
                </details>
              </div>
              {/* rgb(80 77 77 / 87%); */}
              {/* rgb(254 31 31 / 87%); */}

              <button
                className="w-60 py-2 px-4 bg-[#e50914] font-bold text-sm md:text-base rounded"
                onClick={handleLogin}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .content {
    background-color: rgba(0, 0, 0, 0.5);
    grid-template-rows: 15vh 85vh;
  }
`;
