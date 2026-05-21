// // app/firebase.js

// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDQT0R-_v6AC7kGFMQivQeQJcP42KwQ4eM",
//   authDomain: "rovira-54f31.firebaseapp.com",
//   projectId: "rovira-54f31",
//   storageBucket: "rovira-54f31.firebasestorage.app",
//   messagingSenderId: "904883530625",
//   appId: "1:904883530625:web:56473555570d27aeaf5680",
//   measurementId: "G-D384950DLY"
// };

// // Prevent multiple initialization in Next.js
// const app = !getApps().length
//   ? initializeApp(firebaseConfig)
//   : getApp();

// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);

// export default app;

// app/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQT0R-_v6AC7kGFMQivQeQJcP42KwQ4eM",
  authDomain: "rovira-54f31.firebaseapp.com",
  projectId: "rovira-54f31",
  storageBucket: "rovira-54f31.firebasestorage.app",
  messagingSenderId: "904883530625",
  appId: "1:904883530625:web:56473555570d27aeaf5680",
  measurementId: "G-D384950DLY",
};

// Prevent multiple initialization in Next.js
const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;