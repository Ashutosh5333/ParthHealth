import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA9VVvd4HthtvJ4JvLuWa2sVF9CdbK6zVo",
    authDomain: "parth-2d9e4.firebaseapp.com",
    projectId: "parth-2d9e4",
    storageBucket: "parth-2d9e4.firebasestorage.app",
    messagingSenderId: "709511842279",
    appId: "1:709511842279:web:e6fddfcc87d804740c9542",
    measurementId: "G-2VJEJNDZ0N"
  };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);