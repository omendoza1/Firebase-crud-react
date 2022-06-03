// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAK8rs6-ODLNRM_gZO3u6B5ys_zb8AnjU",
  authDomain: "fir-1-3de77.firebaseapp.com",
  projectId: "fir-1-3de77",
  storageBucket: "fir-1-3de77.appspot.com",
  messagingSenderId: "876550441116",
  appId: "1:876550441116:web:680432e48041ab7bf6c559",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db};
