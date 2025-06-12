import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
  projectId: `${process.env.REACT_APP_PROJECT_ID}`,
  storageBucket: "react-netflix-clone-6009c.appspot.com",
  messagingSenderId: "602805764374",
  appId: "1:602805764374:web:346a4d50f0a52387e2d037",
  measurementId: "G-MM1DHY9Q6L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
// now firebase will  point to freeflix app

export const db = getFirestore(app);
// exporting the movies saved to wishlist which are stored in firebase
