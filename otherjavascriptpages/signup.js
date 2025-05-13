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
    createUserWithEmailAndPassword,
    onAuthStateChanged,
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
// const colRef = collection(db, "users");
let loginPage = document.getElementById('loginPage');
let signupPage = document.getElementById('signupPage');
let signinForm = document.getElementById('verifyUser')

function displayLoginpage() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('signinBox').style.display = 'none';
};


function displaySignuppage() {
    document.getElementById('signinBox').style.display = 'block';
    document.getElementById('loginContainer').style.display = 'none';
};

//invoke the anonymous function inside it 
loginPage.addEventListener('click', () => {
    displayLoginpage();
});

signupPage.addEventListener('click', () => {
    displaySignuppage();
});


signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpassword").value;
    

    if (password !== confirmPassword) {
        showAlert('Invalid email or password');
        return;
    };

try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    const users = userCredentials.user;
const user = doc(db,  'user', users.uid)
    await setDoc(user, {
        email : users.email,
        firstname : firstname,
        lastname: lastname,
        userId : users.uid,
        Image: ""
        
    });

    showAlert('signup Successful')
    setTimeout(() => {
        window.location.href = "../index.html"; // Redirect after signup
      }, 1500);
} catch (error) {
    console.log(error);
    
}
})





function showAlert(message) {
    const alertBox = document.getElementById("alertBox");
    alertBox.innerHTML = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000)
}