// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0Z8X9aaMkIFYazSgcoVsOKRLrdO90PRs",
  authDomain: "trial-quiz-d96ba.firebaseapp.com",
  projectId: "trial-quiz-d96ba",
  storageBucket: "trial-quiz-d96ba.appspot.com",
  messagingSenderId: 134355121873,
  appId: "1:134355121873:web:1868d4d12b7aea595e37f0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export default db;
