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

// === Global Refs and Variables ===
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
// const cameFrom = urlParams.get("cameFrom");
const colRef = doc(db, "bestsellers", productId);
const trendingRef = doc(db, "trending", productId);
const addtoCart = doc(db, 'cart', productId);
// const cart = [];
const cartRef = collection(db, "cart");
const relatedRef = collection(db, "bestsellers");
const trendingRelatedRef = collection(db, "trending");
let bestSeller = [], trending = [], relatedProduct = [], relatedTrendingProduct = [], cart = [], relatedCart=[];

// const newsletterRef = collection(db, 'newsletter');



// === Back Navigation ===
function backLink() {
  const backPage = document.getElementById("display");

  const urlParams = new URLSearchParams(window.location.search);
  const cameFrom = urlParams.get("cameFrom"); // ✅ Get cameFrom from the URL

 
  if (cameFrom === 'cart') {
    backPage.innerHTML = `<a href="index.html#addtocart">Back to Cart</a>`;
  } else {
    backPage.innerHTML = `<a href="../index.html">Back to Home</a>`;
  }
}

window.addEventListener('DOMContentLoaded', backLink);

// backLink();

// === fetch add to cart product ==


async function getaddtoCart() {
  try {
    const snapshot = await getDoc(addtoCart);
    if (snapshot.exists()) {
      const product = {id: snapshot.id, ...snapshot.data()};
      cart.push(product);
      displayTrendingProduct(cart);
      getRelatedTrendingproduct(product)
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

// === Fetch Product ===
async function getBestsellerProduct() {
  try {
    const snapshot = await getDoc(colRef);
    if (snapshot.exists()) {
      const product = { id: snapshot.id, ...snapshot.data() };
      bestSeller.push(product);
      displaybestsellerProduct(bestSeller);
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

async function getsingleTrendingProduct() {
  try {
    const snapshot = await getDoc(trendingRef);
    if (snapshot.exists()) {
      const product = { id: snapshot.id, ...snapshot.data() };
      trending.push(product);
      displayTrendingProduct(trending);
      getRelatedTrendingproduct(product);
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

async function getSingleRelatedProducts() {
  try {
    const snapshot = await getDoc(doc(db, "bestsellers", productId));
    if (snapshot.exists()) {
      const product = { id: snapshot.id, ...snapshot.data() };
      displayTrendingProduct([product]);
      getRelatedBestsellerproduct(product);
    }
  } catch (error) {
    console.log(error);
  }
}
getSingleRelatedProducts();

// === Related Products ===
async function getRelatedBestsellerproduct(currentProduct) {
  const q = query(relatedRef, where("category", "==", currentProduct.category));
  try {
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      if (doc.id !== currentProduct.id) {
        relatedProduct.push({ id: doc.id, ...doc.data() });
      }
    });
    displayRelatedProduct();
  } catch (error) {
    console.log(error);
  }
}

async function getRelatedTrendingproduct(currentProduct) {
  const q = query(trendingRelatedRef, where("category", "==", currentProduct.category));
  try {
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      if (doc.id !== currentProduct.id) {
        relatedTrendingProduct.push({ id: doc.id, ...doc.data() });
      }
    });
    displayTrendingRelatedProduct();
  } catch (error) {
    console.log(error);
  }
};





// === Display Functions ===
function displayRelatedProduct() {
  const box = document.getElementById("youmightalsolike");
  box.innerHTML= ''
 relatedProduct.forEach((p) => {
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

function displayTrendingRelatedProduct() {
  const box = document.getElementById("youmightalsolike");
  box.innerHTML = relatedTrendingProduct.map((p) => `
    <div class='box'>
      <a href="./singlepage.html?id=${p.id}&cameFrom=trending">
        <img src='${p.image}' class='img-scale'>
        <div class='wrapper'>
          <p>${p.productname}</p>
          <p>$${p.price}.00</p>
        </div>
      </a>
      <button onclick="addToCart('${p.id}')" class="addtocart">Add to Cart</button>
    </div>
  `).join("");
}


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
        <button class="btn2" onclick=''addtowishList('${product.id}')><i class="fa-regular fa-heart"></i></button>
      </div>
    </div>
  `).join("");
  setupQuantityButtons();
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
        <button class="btn2" onclick=''addtowishList('${product.id}')><i class="fa-regular fa-heart"></i></button>
      </div>


    </div>
  `).join("");
  setupQuantityButtons();

  new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

// == wishlist function ==

// window.addtowishList = async function (productId) {
  
// }

// === Cart Function ===
window.addToCart = async function (productId) {
  const qtyInput = document.getElementById("quantity");
  const quantityToAdd = parseInt(qtyInput?.value || 1);
  const product = [...bestSeller, ...trending, ...cart, ...relatedProduct, ...relatedTrendingProduct].find(p => p.id === productId);
  if (!product) return;

  try {
    const q = query(cartRef, where("productId", "==", product.id));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docToUpdate = snapshot.docs[0];
      const cartItemRef = doc(db, "cart", docToUpdate.id);
      const newQuantity = (docToUpdate.data().quantity || 1) + quantityToAdd;
      // const subtotal = (docToUpdate.price) * newQuantity;
      const newSubtotal = product.price * newQuantity;
      await updateDoc(cartItemRef, { quantity: newQuantity ,
        Subtotal: newSubtotal 
      });
      showAlert("UPDATED CART SUCCESSFULLY");
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
        Subtotal: subtotal
      });
      showAlert("ADDED TO CART");
    }
  } catch (error) {
    console.log("Error adding to cart:", error);
  }
};

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
getaddtoCart()