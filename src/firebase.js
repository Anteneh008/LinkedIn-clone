import firebase from "firebase/compat/app"; //This package provides functionalities to interact with Firebase services.
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBWh08yjnFzBq8Atd1vFiPvlkAxyqwYhQ",
  authDomain: "linkedin-clone-18196.firebaseapp.com",
  projectId: "linkedin-clone-18196",
  storageBucket: "linkedin-clone-18196.appspot.com",
  messagingSenderId: "969138903988",
  appId: "1:969138903988:web:b77d3caa5f8793b842b0e1",
  measurementId: "G-4N3HHGX54N",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
// Initialize the Firebase app with the provided configuration. This sets up the connection to the Firebase project using the specified configuration.
const db = firebaseApp.firestore(); //It will be used to interact with the Firebase Realtime Database
const auth = firebase.auth(); //t will be used for user authentication and handling authentication-related operations
const provider = new firebase.auth.GoogleAuthProvider(); //Create a GoogleAuthProvider object. This is used for Google sign-in authentication
const storage = firebase.storage(); //It will be used for uploading and managing files in the Firebase Storage

export { auth, provider, storage }; //objects so that other parts of the application can access and use them

export default db;
