import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc, query, where, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    getAuth
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
// import { showAlert }d from "./singlepage";



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
const auth = getAuth();

const cartData = [];

onAuthStateChanged(auth, async(user)=>{
    if(!user){
        return
    }

    const cartRef = collection(db, "user", user.uid, "cart");
    try {

       const snapshot = await getDocs(cartRef)
              const cartContainer = document.getElementById("cart-items");
      const totalContainer = document.getElementById("grand-total");
      cartContainer.innerHTML = "";
      
      let grandTotal = 0;

      snapshot.forEach(doc => {
        const item = doc.data();

         const quantity = item.quantity || 1;
        const price = item.price || 0;
        const total = quantity * price;
        grandTotal += total;
cartData.push({ ...item, quantity, price });

 const itemHTML = `
          <div class="cart-item">
            ${item.productname} - ${quantity} x $${price} = $${total}
          </div>
        `;
        cartContainer.innerHTML += itemHTML;
      });

       totalContainer.textContent = `Total: $${grandTotal}`;
       
    } catch (error) {
        console.log(error)
    }
});

const checkout = document.getElementById("checkout-btn");

checkout.addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !email || !address) {
    showAlert("Please fill all fields.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    showAlert("User must be logged in.");
    return;
  }

  try {
    let message = `🛒 New Order:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n📧 Email: ${email}\n📍 Address: ${address}\n\n📦 Items:\n`;
    let grandTotal = 0;

    cartData.forEach((item) => {
      const quantity = item.quantity;
      const price = item.price;
      const total = price * quantity;
      grandTotal += total;
      message += `• ${item.productname} - ${quantity} x ₦${price} = ₦${total}\n`;
    });

    message += `\n🧾 Total: ₦${grandTotal}`;

    const whatsappNumber = "2348139130040";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");

    // Clear cart
    const cartRef = collection(db, "user", user.uid, "cart"); // ✅ Corrected
    const snapshot = await getDocs(cartRef);

    for (const docSnap of snapshot.docs) {
      const itemRef = doc(db, "user", user.uid, "cart", docSnap.id); // ✅ Corrected
      await deleteDoc(itemRef);
    }

    console.log("Cart cleared after checkout.");
  } catch (error) {
    console.error("Error during checkout:", error);
  }
});



function showAlert(message) {
    alertBox.innerHTML = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000);
}