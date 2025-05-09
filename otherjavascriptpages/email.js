
  import { showAlert } from "./singlepage.js";
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import { getFirestore, getDocs, collection, addDoc, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
  
  
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
  
  const newsletterRef = collection(db, 'newsletter');

  
  // Wait for DOM content
  document.addEventListener("DOMContentLoaded", () => {
    // Load EmailJS library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = function () {
      // Initialize EmailJS after it's loaded
      emailjs.init({
        publicKey: '8EE44vqqd4TnnSdiU',
      });
  
      const form = document.getElementById('newsletter');
      if (!form) return;
  
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const email = document.getElementById("email").value;
        const q = query(newsletterRef, where("email", "==", email));
        const snapshot = await getDocs(q);
  
        if (!snapshot.empty) return showAlert("Email already registered");
  
        try {
          await addDoc(newsletterRef, { email });
          await emailjs.sendForm("service_vbjomvt", "template_pzgjgqe", "#newsletter");
          showAlert("Subscribed successfully");
          form.reset();
        } catch (err) {
          console.log(err);
        }
      });
    };
  
    document.head.appendChild(script);
  });
  