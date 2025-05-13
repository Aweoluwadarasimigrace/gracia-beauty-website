import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8ssLFBwiDqNb_Qc5lfnjazBHy6yDxxtA",
  authDomain: "practise-firebase-89eb9.firebaseapp.com",
  projectId: "practise-firebase-89eb9",
  storageBucket: "practise-firebase-89eb9.firebasestorage.app",
  messagingSenderId: "957716840584",
  appId: "1:957716840584:web:7a5f4f0d6e5fe555a7df3d",
  measurementId: "G-D15XM34EE3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'cart');

window.updateCartCount = async function () {
  try {
    const snapshot = await getDocs(colRef);
    const cartArray = snapshot.docs.map(doc => doc.data());
    const cartCount = cartArray.length;

    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }
  } catch (error) {
    console.log("Error updating cart count:", error);
  }
};
window.updateCartCount();
