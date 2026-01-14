// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsutNx99NuaY7fnuyvjJ0ILy_3ScfWQeY",
  authDomain: "shoption-af244.firebaseapp.com",
  projectId: "shoption-af244",
  storageBucket: "shoption-af244.firebasestorage.app",
  messagingSenderId: "390986258141",
  appId: "1:390986258141:web:e1845b7a8e142e5ad82d34",
  measurementId: "G-E5FEE5EC6M",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };