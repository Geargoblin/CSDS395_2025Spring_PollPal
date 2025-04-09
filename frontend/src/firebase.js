import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA_qiNShcnvUeK9VOPuLYGfBctV44uMgjQ",
    authDomain: "pollpall-df8a7.firebaseapp.com",
    projectId: "pollpall-df8a7",
    storageBucket: "pollpall-df8a7.firebasestorage.app",
    messagingSenderId: "5196377596",
    appId: "1:5196377596:web:60e5b9bfb14035201c5679",
    measurementId: "G-GS20576FTJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
