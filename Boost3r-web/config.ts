import { initializeApp } from "firebase/app";
import "firebase/auth";


const firebaseConfig = {
 //Your config
};

export function initFirebase() {
  initializeApp(firebaseConfig);
}

