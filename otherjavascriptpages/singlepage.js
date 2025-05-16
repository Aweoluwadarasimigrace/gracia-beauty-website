// === Firebase Imports ===
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
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
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

// const auth = getAuth(app);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const colRef = doc(db, "bestsellers", productId);
const trendingRef = doc(db, "trending", productId);
let bestSeller = [], trending = [], relatedProduct = [], relatedTrendingProduct = [], cart = [];

// let product = []
// === Auth State Change ===
onAuthStateChanged(auth, async (user) => {
  if (user) {
    getaddtoCart();
    window.updateCartCount();
  }
});



// === fetch add to cart product ==
async function getaddtoCart() {
  const user = auth.currentUser;
  if (!user) return;


  try {
    const cartRef = doc(db, "user", user.uid, "cart", productId);
    const snapshot = await getDoc(cartRef);
    if (snapshot.exists()) {
      const product = { id: snapshot.id, ...snapshot.data() };
      // const product = snapshot.data()
      cart.push(product);
      console.log(product);

      displayTrendingProduct(cart);
      getRelatedProduct(product)
      loaderr.style.display = 'none';
      loader.style.display = 'none'
      loader.hidden = true
      footer.hidden = false
      news.hidden = false
      header.style.visibility = 'visible'
      like.hidden = false
      nav.hidden = false
      head.hidden = false
      review.style.visibility = 'visible';
    }
  } catch (error) {
    console.log(error);

  }
};


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



// === Fetch Product ===
async function getBestsellerProduct() {
  try {
    const snapshot = await getDoc(colRef);
    if (snapshot.exists()) {
      const product = { id: snapshot.id, ...snapshot.data() };
      bestSeller.push(product);
      displaybestsellerProduct(bestSeller);
      getRelatedProduct(product)
      loaderr.style.display = 'none';
      loader.style.display = 'none'
      loader.hidden = true
      footer.hidden = false
      news.hidden = false
      header.style.visibility = 'visible'
      like.hidden = false
      nav.hidden = false
      head.hidden = false
      review.style.visibility = 'visible'
    }
  } catch (error) {
    console.log(error);
  }
}


// using for of to get the rest single page 

const allProduct = ['eyes', 'faceproduct', 'lipgloss product']
const products = [];
async function getsingleAllProduct() {
  
  try {
    for (const name of allProduct) {
      const productRef = doc(db, name, productId);
      const snapshot = await getDoc(productRef);
      if (snapshot.exists()) {
        const productData = { id: snapshot.id, ...snapshot.data() }
        products.push(productData);
        console.log(products)
        displayTrendingProduct(products);
        getRelatedProduct(productData);
        loaderr.style.display = 'none';
      loader.style.display = 'none'
      loader.hidden = true
      footer.hidden = false
      news.hidden = false
      header.style.visibility = 'visible'
      like.hidden = false
      nav.hidden = false
      head.hidden = false
      review.style.visibility = 'visible'
      }
    }
  } catch (error) {
    console.log(error)
  }
}

async function getsingleTrendingProduct() {
  try {
    const snapshot = await getDoc(trendingRef);
    if (snapshot.exists()) {
      const product = { id: snapshot.id, ...snapshot.data() };
      trending.push(product);
      displayTrendingProduct(trending);
      getRelatedProduct(product);
      loaderr.style.display = 'none';
      loader.style.display = 'none'
      loader.hidden = true
      footer.hidden = false
      news.hidden = false
      header.style.visibility = 'visible'
      like.hidden = false
      nav.hidden = false
      head.hidden = false
      review.style.visibility = 'visible'
    }
  } catch (error) {
    console.log(error);
  }
};


// === Get Related Products from Multiple Collections ===

let array = ['bestsellers', 'trending', 'lipgloss product', "eyes", "faceproduct"];


async function getRelatedProduct(currentProduct) {
  const user = auth.currentUser
  if (!user) return;



  // const cartId = collection(db, 'user', user.uid, 'cart')
  // const cartSnapshot = await getDocs(cartId);
  // const cartProductId = cartSnapshot.docs.map(doc =>
  //   doc.data().productId)

  try {
    for (const collectionName of array) {
      const relatedRef = collection(db, collectionName);

      const q = query(relatedRef, where('category', '==', currentProduct.category));
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        if (doc.id !== currentProduct.id ) {
          relatedProduct.push({ id: doc.id, ...doc.data() });

        }
      });

    };

    displayRelatedProduct(relatedProduct)
  } catch (error) {
    console.log(error);

  }
}



// === Cart Function ===


window.addToCart = async function (productId) {
  const user = auth.currentUser;
  if (!user) {
    showAlert('Login before you can add to cart');
    return;
  }
  // console.log(productname);


  const qtyInput = document.getElementById("quantity");
  const quantityToAdd = parseInt(qtyInput?.value || 1);

  const product = [...bestSeller, ...trending, ...cart, ...relatedProduct, ...relatedTrendingProduct, ...products].find(p => p.id === productId)

  if (!product) return;

  try {
    const cartRef = collection(db, "user", user.uid, "cart");
    const q = query(cartRef, where("productId", "==", product.id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docToUpdate = snapshot.docs[0];
      const cartItemRef = doc(db, "user", user.uid, "cart", docToUpdate.id);
      const newQuantity = (docToUpdate.data().quantity || 1) + quantityToAdd;
      const newSubtotal = product.price * newQuantity;

      await updateDoc(cartItemRef, {
        quantity: newQuantity,
        subtotal: newSubtotal,
      });
      showAlert("Updated cart successfully!");
    } else {
      const subtotal = product.price * quantityToAdd;
      await addDoc(cartRef, {
        image: product.image,
        productdescription: product.productdescription,
        productname: product.productname,
        price: product.price,
        productId: product.id,
        quantity: quantityToAdd,
        category: product.category,
        subtotal: subtotal
      });
      showAlert("Added to cart!");
    }

    window.updateCartCount();
  } catch (error) {
    console.log("Error adding to cart:", error);
  }
};


// ==add eventlisner for the button ==


function setWishlist() {
  const wishlistBtns = document.querySelectorAll(".addToWishlistBtn");
  wishlistBtns.forEach(btn => {
    const productId = btn.dataset.productId;

    // Attach click event listener
    btn.addEventListener('click', () => {
      window.addtowishList(productId);
    });
  });
}
// == wishlist function ==

window.addtowishList = async function (productId, productname) {
  const user = auth.currentUser;
  if (!user) {
    showAlert('Login before you can add to wishlist');
    return;
  }

  const product = [...bestSeller, ...trending, ...cart, ...relatedProduct, ...relatedTrendingProduct, ...products].find(p => p.id === productId && p.productname.toLowerCase() === productname.toLowerCase());
  if (!product) return;

  const quantityToAdd = 1;
  const subtotal = product.price * quantityToAdd;

  try {
    const wishRef = collection(db, 'user', user.uid, 'wishlist');
    const q = query(wishRef, where('productId', '==', product.id));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      showAlert('Item is already in the wishlist');
    } else {
      await addDoc(wishRef, {
        image: product.image,
        productdescription: product.productdescription,
        productname: product.productname,
        price: product.price,
        productId: product.id,
        quantity: quantityToAdd,
        category: product.category,
        subtotal: subtotal
      });
      showAlert('Added to wishlist');
    }
  } catch (error) {
    console.log(error);
    showAlert('Failed to add to wishlist');
  }
};


// === Search Product by Name ===

const productCollection = ['bestsellers', 'trending', 'eyes', 'faceproduct', 'lipgloss product'];

async function searchproductByname(searchTerm) {
  const results = [];

  try {
    for (const products of productCollection) {
      const refs = collection(db, products);
      const snapshot = await getDocs(refs);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const nameMatch = data.productname?.toLowerCase().includes(searchTerm);
        const ifNameIsTheSame = results.find(p => p.productname === data.productname)
        if (nameMatch && !ifNameIsTheSame) {
          results.push({ id: doc.id, ...doc.data() });
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




// === Display Functions ===
function displayRelatedProduct(product) {
  const box = document.getElementById("youmightalsolike");
  box.innerHTML = ''
  product.forEach((p) => {
    box.innerHTML +=
      `
    <div class='box'>
      <a href="./singlepage.html?id=${p.id}&cameFrom=bestsellers">
        <img src='${p.image}' class='img-scale'>
        <div class='wrapper'>
          <p>${p.productname}</p>
          <p>$${p.price}.00</p>
        </div>
      </a>
      <button onclick="addToCart('${p.id}')" class="addtocart">Add to Cart</button>
    </div>
  `
  })
}


function displayTrendingProduct(products) {
  const container = document.getElementById("containerr");
  container.innerHTML = products.map(product => `
    <div class="image-wrappers">
      <img src="${product.image}" alt="">
    </div>
    <div class="product-title">
      <div class="title-wrapper">
        <h1>${product.productname}</h1>
        <p class="price">$${product.price}.00</p>
        <p class="category">${product.category}</p>
        <p class = 'description'>${product.productdescription}</p>
      </div>
      <div class="quantity-control">
        <button id="decreaseBtn">-</button>
        <input type="number" id="quantity" value="1" min="1" readonly>
        <button id="increaseBtn">+</button>
      </div>
      <div class="addtoCart">
        <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
        <button class="btn2 addToWishlistBtn" data-product-id = "${product.id}"><i class="fa-regular fa-heart"></i></button>
      </div>
    </div>
  `);
  setupQuantityButtons();
  setWishlist()
}

function displaybestsellerProduct(products) {
  const container = document.getElementById("containerr");
  container.innerHTML = products.map(product => `
    <div class="image-wrapperr">
      ${createSwiper(product.image)}
    </div>
    <div class="product-title">
      <div class="title-wrapper">
        <h1>${product.productname}</h1>
        <p class="price">$${product.price}.00</p>
        <p class="category">Category: ${product.category}</p>
        <p class='description' > ${product.productdescription}</p>
      </div>
      <div class="quantity-control">
        <button id="decreaseBtn">-</button>
        <input type="number" id="quantity" value="1" min="1" readonly>
        <button id="increaseBtn">+</button>
      </div>
      <div class="addtoCart">
        <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
        <button class="btn2 addToWishlistBtn" data-product-id ="${product.id}"><i class="fa-regular fa-heart"></i></button>
      </div>


    </div>
  `).join("");
  setupQuantityButtons();
  setWishlist();

  new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
};

function createSwiper(imageArray) {
  const slides = imageArray.map((img) => `
    <div class="swiper-slide"><img src="${img}"></div>
  `).join("");
  return `<div class="swiper mySwiper"><div class="swiper-wrapper">${slides}</div><div class="swiper-pagination"></div></div>`;
}

function setupQuantityButtons() {
  const qtyInput = document.getElementById("quantity");
  document.getElementById("increaseBtn").addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
  });
  document.getElementById("decreaseBtn").addEventListener("click", () => {
    if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
  });
};


// onAuthStateChanged(auth, (user)=>{
//     if(user){
//         log.style.display = 'none';
//         let display = document.getElementById('displayy');
//         display.classList.add('auth-visible');
//         getcurrentUser(user?.uid);
//     }
//   else{
//     display.classList.remove('auth-visible');
//   }

// })


async function getcurrentUser(userId) {
    const colRef = collection(db, "user");
    const q = query(colRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((user)=>{
        displayUser(user.data())
        displayyUser(user.data())
    })
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



// === Misc UI Functions ===

document.getElementById('showMenu').addEventListener('click', showMenu);
document.getElementById('closeMenu').addEventListener('click', closeMenu);
document.getElementById('showSearchBar').addEventListener('click', showSearchBar);
document.getElementById('closeSearchBar').addEventListener('click', closeSearchBar);

function showMenu() {
  let menuList = document.getElementById("hiddenMenuBar");
  menuList.style.visibility = "visible";
}

function closeMenu() {
  let menu = document.getElementById("hiddenMenuBar");
  menu.style.visibility = "hidden";
}

function showSearchBar() {
  let searchBar = document.getElementById("searchBar");
  searchBar.style.display = "block";
}

function closeSearchBar() {
  let searchbar = document.getElementById("searchBar");
  searchbar.style.display = "none";
}


// === Newsletter ===

const alertBox = document.getElementById("alertBox");
export function showAlert(message) {
  alertBox.innerHTML = message;
  alertBox.style.display = "block";
  setTimeout(() => alertBox.style.display = "none", 2000);
}

// === Init ===
getBestsellerProduct();
getsingleTrendingProduct();
getsingleAllProduct()
// getaddtoCart();