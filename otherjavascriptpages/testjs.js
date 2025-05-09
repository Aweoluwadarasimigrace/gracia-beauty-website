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
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const cameFrom = urlParams.get("cameFrom");

const colRef = doc(db, "bestsellers", productId);
const trendingRef = doc(db, "trending", productId);
const relatedRef = collection(db, "bestsellers");
const trendingRelatedRef = collection(db, "trending");

const backPage = document.getElementById("display");
let bestSeller = [];
let trending = [];
const cartRef = collection(db, 'cart');
let relatedTrendingProduct = [];
let relatedProduct = [];
function backLink() {
  if (cameFrom === "bestsellers") {
    backPage.innerHTML = `<a href="index.html#bestsellers">Back to Bestsellers</a>`;
  } else {
    backPage.innerHTML = `<a href="../index.html">Back to Home</a>`;
  }
}
backLink();

async function getBestsellerProduct() {
  try {
    const docsnapShot = await getDoc(colRef);
    if (docsnapShot.exists()) {
      const data = docsnapShot.data();
      const bestsellerProduct = { id: docsnapShot.id, ...data };
      bestSeller.push(bestsellerProduct);
      displaybestsellerProduct(bestSeller);
      getRelatedBestsellerproduct(bestsellerProduct);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getsingleTrendingProduct() {
  try {
    const docsnapshot = await getDoc(trendingRef);
    if (docsnapshot.exists()) {
      const data = docsnapshot.data();
      const trendingProduct = { id: docsnapshot.id, ...data };
      trending.push(trendingProduct);
      displayTrendingProduct(trending);
      getRelatedTrendingproduct(trendingProduct);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getSingleRelatedProducts() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const productRef = doc(db, "bestsellers", productId);

  try {
    const docsnapshot = await getDoc(productRef);
    if (docsnapshot.exists()) {
      const data = docsnapshot.data();
      const product = { id: docsnapshot.id, ...data };

      displayTrendingProduct([product]);
      getRelatedBestsellerproduct(product);
      displayRelatedProduct([product]);
    }
  } catch (error) {
    console.log(error);
  }
};

getSingleRelatedProducts();





// get related bestseller product
async function getRelatedBestsellerproduct(currentProduct) {
  const q = query(relatedRef, where("category", "==", currentProduct.category));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.id !== currentProduct.id) {
        const data = { id: doc.id, ...doc.data() };
        relatedProduct.push(data);
      }
    });
    displayRelatedProduct();
  } catch (error) {
    console.log(error);
  }
};

// display bestseller related product
function displayRelatedProduct() {
    let box = document.getElementById("youmightalsolike");
    box.innerHTML = "";
    relatedProduct.forEach((products) => {
      box.innerHTML += `
        <div class='box'>
          <a href="./singlepage.html?id=${products.id}&cameFrom=bestsellers">
            <img src='${products.image}' class='img-scale'>
            <div class='wrapper'>
              <p>${products.productname}</p>
              <p> $ ${products.price}.00 </p>
            </div>
          </a> 
           <button onclick="addTocart('${products.id}')" class = 'addtocart'>add to cart</button>
        </div>
      `;
    });
  }
  

async function getRelatedTrendingproduct(currentProduct) {
  const q = query(
    trendingRelatedRef,
    where("category", "==", currentProduct.category)
  );
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docs) => {
      if (docs.id !== currentProduct.id) {
        const data = { id: docs.id, ...docs.data() };
        relatedTrendingProduct.push(data);
      }
    });
    displayTrendingRelatedProduct();
  } catch (error) {
    console.log(error);
  }
}



function displayTrendingRelatedProduct() {
    let box = document.getElementById("youmightalsolike");
  
    box.innerHTML = "";
    relatedTrendingProduct.forEach((product) => {
      box.innerHTML += `
        <div class='box'>
          <a href="./singlepage.html?id=${product.id}&cameFrom=trending">
            <img src='${product.image}' class='img-scale'>
            <div class='wrapper'>
              <p>${product.productname}</p>
              <p> $ ${product.price}.00 </p>
            </div>
          </a> 
           <button onclick="addTocart('${product.id}')" class = 'addtocart'>add to cart</button>
        </div>
      `;
    });
  }
  
  

// to display related product fro trnding


//  add to cart related product


function displayTrendingProduct(trendingProduct) {
  let container = document.getElementById("containerr");
  container.innerHTML = "";
  trendingProduct.forEach((product) => {
    container.innerHTML = `
      <div class="image-wrappers">
        <img src="${product.image}" alt="">
        <p>${product.productdescription}</p>
      </div>
      
      <div class="product-title">
        <div class="title-wrapper">
          <h1>${product.productname}</h1>
          <p class = 'price'> $ ${product.price}.00</p>
          <p class = 'category'>${product.category}</p>
        </div>

        <div class="quantity-control">
          <button id= "decreaseBtn">-</button>
          <input type="number" id="quantity" value= '${product.quantity}' min="1" readonly>
          <button id="increaseBtn">+</button>
        </div>

        <div class="addtoCart">
          <button class="btn" onclick="addtocart('${product.id}')">Add to Cart</button>
          <button class="btn2"><i class="fa-regular fa-heart"></i></button>
        </div>

        <div class="shippin">
          <h1>SHIPPING POLICY</h1>
          <p>Gracia processes orders within 1–2 business days, with standard shipping taking 3–7 business days...</p>
        </div>
      </div>
    `;
  });

  const qtyInput = document.getElementById('quantity');
  const decreaseBtn = document.getElementById('decreaseBtn');
  // const addToCartBtn = document.getElementById('addToCartBtn');


  document.getElementById('increaseBtn').addEventListener('click', () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
  });


  decreaseBtn.addEventListener('click', () => {
      if (parseInt(qtyInput.value) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
      }
    });


  window.addtocart = async function (productId) {
    const quantity = document.getElementById('quantity');
    const quantityInput = parseInt(quantity.value) || 1
    const product = trending.find((product)=> product.id === productId);
      try {
          
     const q = query(cartRef, where('productId', '==', product.id));
     const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
              const docToupdate = querySnapshot.docs[0];
              const newQuantity = docToupdate.data().quantity || 1
              const cartItemRef = doc(db, 'cart', docToupdate.id);
  
              await updateDoc(cartItemRef, {
                  quantity: newQuantity + quantityInput
              });
              showAlert('UPDATED CART SUCESSFULLY');
          } else {
              await addDoc(cartRef, {
                  image: product.image,
                  productdescription: product.productdescription,
                  productname: product.productname,
                  price: product.price,
                  productId: product.id,
                  quantity: product.quantity
              });
          }
      alert('added to cart')
      } catch (error) {
          console.log(error);
          
      }
      
  }



  
};





function createSwiper(imageArray) {
  const slides = imageArray.map((image) => {
    return `
      <div class="swiper-slide">
        <img src="${image}">
      </div>
    `;
  });

  return `
    <div class="swiper mySwiper">
      <div class="swiper-wrapper">
        ${slides.join("")}
      </div>
      <div class="swiper-pagination"></div>
    </div>
  `;
}

function displaybestsellerProduct(productArray) {
  let containerr = document.getElementById("containerr");
  containerr.innerHTML = "";

  productArray.forEach((product) => {
    const swiperHtml = createSwiper(product.image);
    containerr.innerHTML = `
      <div class="image-wrapperr">
        ${swiperHtml}
        <p>${product.productdescription}</p>
      </div>

      <div class="product-title">
        <div class="title-wrapper">
          <h1>${product.productname}</h1>
          <p class="price"> $ ${product.price}.00</p>
          <p class="category">Category: ${product.category}</p>
        </div>

        <div class="quantity-control">
          <button id="decreaseBtn">-</button>
          <input type="number" id="quantity" value="1" min="1" readonly>
          <button id = 'increaseBtn'>+</button>
        </div>

        <div class="addtoCart">
          <button class="btn"  onclick="addtocart(${product.id})">Add to Cart</button>
          <button class="btn2"><i class="fa-regular fa-heart"></i></button>
        </div>

        <div class="shippin">
          <h1>SHIPPING POLICY</h1>
          <p>Gracia processes orders within 1–2 business days, with standard shipping taking 3–7 business days...</p>
        </div>
      </div>
    `;
  });


  const qtyInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseBtn');
    // const addToCartBtn = document.getElementById('addToCartBtn');


    document.getElementById('increaseBtn').addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });


    decreaseBtn.addEventListener('click', () => {
        if (parseInt(qtyInput.value) > 1) {
          qtyInput.value = parseInt(qtyInput.value) - 1;
        }
      });


      window.addtocart = async function (productId) {
        const quantity = document.getElementById('quantity');
        const quantityInput = parseInt(quantity.value) || 1
        const product = bestSeller.find((product)=> product.id === productId);
          try {
              
         const q = query(cartRef, where('productId', '==', product.id));
         const querySnapshot = await getDocs(q);
      
              if (!querySnapshot.empty) {
                  const docToupdate = querySnapshot.docs[0];
                  const newQuantity = docToupdate.data().quantity || 1
                  const cartItemRef = doc(db, 'cart', docToupdate.id);
      
                  await updateDoc(cartItemRef, {
                      quantity: newQuantity + quantityInput
                  });
                  showAlert('UPDATED CART SUCESSFULLY');
              } else {
                  await addDoc(cartRef, {
                      image: product.image,
                      productdescription: product.productdescription,
                      productname: product.productname,
                      price: product.price,
                      productId: product.id,
                      quantity: product.quantity
                  });
              }
          alert('added to cart')
          } catch (error) {
              console.log(error);
              
          }
          
      }
    
    
    
    
    

  new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}













function showMenu() {
  let menuList = document.getElementById("hiddenMenuBar");
  menuList.style.visibility = "visible";
}

function closeMenu() {
  let menu = document.getElementById("hiddenMenuBar");
  menu.style.visibility = "hidden";
}

// email.js
const newsletter = document.getElementById("newsletter");
const alertBox = document.getElementById("alertBox");
const newsletterRef = collection(db, "newsletter");

newsletter.addEventListener("submit", async (e) => {
  e.preventDefault();
  let emails = document.getElementById("email").value;

  const q = query(newsletterRef, where("email", "==", emails));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    showAlert("Email already registered");
    return;
  }

  try {
    await addDoc(newsletterRef, { email: emails });
    await emailjs.sendForm("service_vbjomvt", "template_pzgjgqe", "#newsletter");
    showAlert("Subscribed successfully");
    newsletter.reset();
  } catch (error) {
    console.log(error);
  }
});

function showAlert(message) {
  alertBox.innerHTML = message;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000);
}

getBestsellerProduct();
getsingleTrendingProduct();



window.addtocart = async function (productId) {
  const quantity = document.getElementById('quantity');
  const quantityInput = parseInt(quantity.value) || 1
  const product = trending.find((product)=> product.id === productId);
    try {
        
   const q = query(cartRef, where('productId', '==', product.id));
   const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docToupdate = querySnapshot.docs[0];
            const newQuantity = docToupdate.data().quantity || 1
            const cartItemRef = doc(db, 'cart', docToupdate.id);

            await updateDoc(cartItemRef, {
                quantity: newQuantity + quantityInput
            });
            showAlert('UPDATED CART SUCESSFULLY');
        } else {
            await addDoc(cartRef, {
                image: product.image,
                productdescription: product.productdescription,
                productname: product.productname,
                price: product.price,
                productId: product.id,
                quantity: product.quantity
            });
        }
    alert('added to cart')
    } catch (error) {
        console.log(error);
        
    }
    
}