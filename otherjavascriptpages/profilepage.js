
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    collection,
    query, where,
    getDocs
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
    measurementId: "G-D15XM34EE3"
  };

  // === Initialize Firebase ===
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  // === DOM Elements ===
  const firstnameInput = document.getElementById("firstname");
  const lastnameInput = document.getElementById("lastname");
  const imageUpload = document.getElementById("imageUpload");
  const profileImagePreview = document.getElementById("profileImagePreview");
  const profileForm = document.getElementById("profileForm");
  const profileDisplayImg = document.getElementById("profileDisplayImg");
  const profileDisplayName = document.getElementById("profileDisplayName");
  const logoutBtn = document.getElementById("logoutBtn");

  // === Auth State ===
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "./login.html";
      return;
    }

    const userRef = doc(db, "user", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      firstnameInput.value = data.firstname || "";
      lastnameInput.value = data.lastname || "";
      profileImagePreview.src = data.image || "update profile picture";
      profileDisplayImg.src = data.image || "update profile picture";
      profileDisplayName.textContent = `${data.firstname || ""} ${data.lastname || ""}`.trim();
      // window.updateCartCount();
    } else {
      showAlert("User data not found");
    }
  });

  // === Update Profile ===
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const firstname = firstnameInput.value.trim();
    const lastname = lastnameInput.value.trim();
    const userRef = doc(db, "user", user.uid);

    let photoURL = profileImagePreview.src;

    // If new image selected
    if (imageUpload.files[0]) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        photoURL = event.target.result;
        await updateDoc(userRef, {
          firstname,
          lastname,
          image: photoURL
        });
        updateUI(firstname, lastname, photoURL);
        updateDoc(userRef, {firstname, lastname, photoURL})
        showAlert("Profile updated successfully");
      };
      reader.readAsDataURL(imageUpload.files[0]);
    } else {
      // No image change
      await updateDoc(userRef, { firstname, lastname });
      updateUI(firstname, lastname, photoURL);
      showAlert("Name updated successfully");
    }
  });

  // === Update UI Function ===
  function updateUI(firstname, lastname, photoURL) {
    profileDisplayName.textContent = `${firstname} ${lastname}`;
    profileDisplayImg.src = photoURL;
    profileImagePreview.src = photoURL;
  }

  // === Logout ===
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "./login.html";
  });

  // === Alert Function ===
  const alertBox = document.getElementById("alertBox");
  function showAlert(message) {
    alertBox.innerHTML = message;
    alertBox.style.display = "block";
    setTimeout(() => (alertBox.style.display = "none"), 2000);
  }

  // === Menu & Search Bar Functions ===
  document.getElementById("showMenu").addEventListener("click", () => {
    document.getElementById("hiddenMenuBar").style.visibility = "visible";
  });

  document.getElementById("closeMenu").addEventListener("click", () => {
    document.getElementById("hiddenMenuBar").style.visibility = "hidden";
  });

  document.getElementById("showSearchBar").addEventListener("click", () => {
    document.getElementById("searchBar").style.display = "block";
  });

  document.getElementById("closeSearchBar").addEventListener("click", () => {
    document.getElementById("searchBar").style.display = "none";
  });
  
  

  onAuthStateChanged(auth, (user)=>{
      if(user){
          log.style.display = 'none';
          let display = document.getElementById('displayy');
          display.classList.add('auth-visible');
          getcurrentUser(user?.uid);
      }
    else{
      display.classList.remove('auth-visible');
    }
  
  })
  
  
  async function getcurrentUser(userId) {
      const colRef = collection(db, "user");
      const q = query(colRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((user)=>{
          displayUser(user.data())
          displayyUser(user.data())
      })
  }
  
  
  
  function displayUser(user) {
      let containers = document.getElementById('displayy');
  
      containers.innerHTML = 
      `
       <a href="./profilepage.html">
       <img src="${user.image}" alt="">
                      <p class="username"> ${user.firstname}</p>
       </a>
  
      `
      
  }


  function displayyUser(user) {
    let containers = document.getElementById('display');

    containers.innerHTML = 
    `
     <a href="./profilepage.html">
     <img src="${user.image}" alt="">
                    <p class="username"> ${user.firstname}</p>
     </a>

    `
    
}

  const productCollection = ['bestsellers', 'trending', 'eyes', 'faceproduct', 'lipgloss product'];
  
  async function searchproductByname(searchTerm) {
    const results = [];
  
    try {
      for (const products of productCollection) {
        const refs = collection(db, products);
      //   console.log(`Checking collection: ${products}`);
        const snapshot = await getDocs(refs);
  
        snapshot.forEach((doc) => {
          const data = doc.data();
          const productName = data.productname?.toLowerCase()
          const nameMatch = productName.includes(searchTerm);
          
  
  
          if (nameMatch) {
            const existing = results.find((item)=> item.productname?.toLowerCase() === productName)
          if(!existing){
              results.push({ id: doc.id, ...doc.data() });
          }
          }
        });
      };
  
    } catch (error) {
      console.log(error);
    };
  
    return results
  }

  


  // == display search results
function displaySearchResults(searchResult) {
  let searchContainer = document.getElementById('searchContainer');
  searchContainer.innerHTML = '';

  if (searchResult.length === 0) {
    searchContainer.innerHTML = `<p> no product available</p>`
    return
  }

  searchResult.forEach(product => {
    searchContainer.innerHTML += `
    <div class="productCard">
       <a href="./singlepage.html?id=${product.id}">
           <img src="${product.image}" alt="">
          <div class="details">
           <h3>${product.productname}</h3>
           <p>$${product.price}.00</p>
          </div>
       </a>
   </div>
   `
  })

};

document.getElementById('searchTerm').addEventListener('input', async (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();

  if (searchTerm === '') {
    document.getElementById('searchContainer').innerHTML = '';
    return;
  }
  const results = await searchproductByname(searchTerm);
  displaySearchResults(results);
});
  

window.updateCartCount = async function () {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const cartRef = collection(db, "user", user.uid, "cart");
    const snapshot = await getDocs(cartRef);
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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    window.updateCartCount();
  }
});
