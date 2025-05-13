import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
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

// === DOM Elements ===
const firstnameInput = document.getElementById('firstname');
const lastnameInput = document.getElementById('lastname');
const imageUpload = document.getElementById("imageUpload");
const profileImagePreview = document.getElementById('profileImagePreview');
const profileForm = document.getElementById("profileForm");
const profileDisplayImg = document.getElementById("profileDisplayImg");
const profileDisplayName = document.getElementById("profileDisplayName");
const logoutBtn = document.getElementById("logoutBtn");

// === Check if User is Logged In and Load Profile from Firestore ===
onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "user", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    firstnameInput.value = data.firstname || "";
    lastnameInput.value = data.lastname || "";
    profileImagePreview.src = data.image || "https://via.placeholder.com/100";
    profileDisplayImg.src = data.photoimage || "https://via.placeholder.com/80";
    profileDisplayName.textContent = `${data.firstname || ""} ${data.lastname || ""}`.trim();
  } else {
    profileDisplayName.textContent = "User data not found";
  }
});

// === Update Profile in Firestore ===
profileForm.addEventListener("submit", async e => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return;

  const firstname = firstnameInput.value.trim();
  const lastname = lastnameInput.value.trim();
  const userRef = doc(db, "user", user.uid);

  let photoURL = profileImagePreview.src; // default to current one

  if (imageUpload.files[0]) {
    const reader = new FileReader();
    reader.onload = async function (event) {
      photoURL = event.target.result;
      await updateDoc(userRef, { firstname, lastname, photoURL });

      updateUI(firstname, lastname, photoURL);
      alert("Profile updated!");
    };
    reader.readAsDataURL(imageUpload.files[0]);
  } else {
    await updateDoc(userRef, { firstname, lastname });
    updateUI(firstname, lastname, photoURL);
    alert("Profile updated!");
  }
});

// === Update UI after saving ===
function updateUI(firstname, lastname, photoURL) {
  profileDisplayName.textContent = `${firstname} ${lastname}`;
  profileDisplayImg.src = photoURL;
  profileImagePreview.src = photoURL;
}

// === Logout ===
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
