
import { initializeApp } from "@firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiqai-b7b6e.firebaseapp.com",
  projectId: "interviewiqai-b7b6e",
  storageBucket: "interviewiqai-b7b6e.firebasestorage.app",
  messagingSenderId: "898872632920",
  appId: "1:898872632920:web:394e2ed977caec5c980c2d",
  measurementId: "G-YFWBSFRG92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
