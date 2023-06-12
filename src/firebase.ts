import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'

/**
 * Additional elements of Firebase we'll use.
 */
import "firebase/auth";
import "firebase/messaging";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyChoAA30crdjLcU2p0hf1xKgTh-0SVPwgE",
  authDomain: "daily-d5d73.firebaseapp.com",
  projectId: "daily-d5d73",
  storageBucket: "daily-d5d73.appspot.com",
  messagingSenderId: "994078530202",
  appId: "1:994078530202:web:c50a237d67fdb0a02c1d23",
})

// used for the firestore refs
export const db = getFirestore(firebaseApp)

export const todosRef = collection(db, 'todos')

export const messaging = getMessaging(firebaseApp);
