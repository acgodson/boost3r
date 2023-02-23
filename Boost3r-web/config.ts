import { initializeApp } from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUoesoaqNq4ZSVpnbn9x9lPx0Pjmzjydo",
  authDomain: "boost3r.firebaseapp.com",
  projectId: "boost3r",
  storageBucket: "boost3r.appspot.com",
  messagingSenderId: "451706698017",
  appId: "1:451706698017:web:3c651bc6ff9ad03654e660",
  measurementId: "G-9V0QT5BH28",
};

export function initFirebase() {
  initializeApp(firebaseConfig);
}

export const POAP_ADDRESS = "0x2C668a20C78BB3E484E903450ABFea8aF917F760";
export const BST_ADDRESS = "0x6280b9b5Aac7851eF857884b50b86129809aF7Ab";
export const CAMPAIGN_ADDRESS = "0xd828bE487aB804662BFD5340E958ba4Cd5C64a85";
export const WETH_ADDRESS = "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111";
