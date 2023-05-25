// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTtkWhHpDt7pYLUQMMVOrbqtPHvosUs38",
    authDomain: "assetes-d737a.firebaseapp.com",
    projectId: "assetes-d737a",
    storageBucket: "assetes-d737a.appspot.com",
    messagingSenderId: "570338781998",
    appId: "1:570338781998:web:46747e9447d41d4887e8bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)