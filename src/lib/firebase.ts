// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAf9uNN6tI1MxAIeFQzVTotFZicVG1m4k8",
  authDomain: "topperstoolkit-63d3a.firebaseapp.com",
  projectId: "topperstoolkit-63d3a",
  storageBucket: "topperstoolkit-63d3a.firebasestorage.app",
  messagingSenderId: "979936342565",
  appId: "1:979936342565:web:52517f920d42c8bada05cc",
  measurementId: "G-4MR8EHPVJW"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
