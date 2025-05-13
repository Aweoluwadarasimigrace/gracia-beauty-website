import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getFirestore,
    getDocs,
    collection,
    addDoc,
    query,
    where,
    getDoc,
    doc,
    updateDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    getAuth
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


// === Firebase Config ===
const firebaseConfig = {
    apiKey: "AIzaSyB8ssLFBwiDqNb_Qc5lfnjazBHy6yDxxtA",
    authDomain: "practise-firebase-89eb9.firebaseapp.com",
    projectId: "practise-firebase-89eb9",
    storageBucket: "practise-firebase-89eb9.appspot.com",
    messagingSenderId: "957716840584",
    appId: "1:957716840584:web:7a5f4f0d6e5fe555a7df3d",
    measurementId: "G-D15XM34EE3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      if(userCredentials.user){
        showAlert('login successful');
          window.location.href = "../index.html"
      }else{
        showAlert('account not regisered');
        window.location.href = "./signup.html"
      }
    } catch (error) {
        console.log(error);

        
    }
})


const alertBox = document.getElementById("alertBox");
 function showAlert(message) {
  alertBox.innerHTML = message;
  alertBox.style.display = "block";
  setTimeout(() => alertBox.style.display = "none", 2000);
}
