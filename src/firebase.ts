import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAVzJEdVA2RTEWl2sxCaGZyC5WHe3JKFLA',
  authDomain: 'graphiql-react-rsschool.firebaseapp.com',
  projectId: 'graphiql-react-rsschool',
  storageBucket: 'graphiql-react-rsschool.appspot.com',
  messagingSenderId: '457812089131',
  appId: '1:457812089131:web:b14804a1d6812cfca30d6e',
  measurementId: 'G-HG7RJ1KM55',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
