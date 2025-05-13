// Firebase & EmailJS Integration

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8ssLFBwiDqNb_Qc5lfnjazBHy6yDxxtA",
    authDomain: "practise-firebase-89eb9.firebaseapp.com",
    projectId: "practise-firebase-89eb9",
    storageBucket: "practise-firebase-89eb9.firebasestorage.app",
    messagingSenderId: "957716840584",
    appId: "1:957716840584:web:7a5f4f0d6e5fe555a7df3d",
    measurementId: "G-D15XM34EE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firestore Collections
// const cartRef = collection(db, 'cart');
const colRef = collection(db, 'bestsellers');
const trendingRef = collection(db, 'trending');
const trending = [];
const bestSeller = [];
let container = document.getElementById('container');
let trendingContainer = document.getElementById('trendingContainer');
// HTML Elements
const shopbestseller = document.getElementById('shopBestseller');
const shoplip = document.getElementById('shoplip');
const shopNow = document.getElementById('shopNow');


// Redirect user to Bestsellers page
shopbestseller.addEventListener('click', () => {
    window.location.href = "./otherhtmlpages/bestselller.html";
});

shoplip.addEventListener('click', ()=>{
    window.location.href = './otherhtmlpages/lips.html';
});
shopNow.addEventListener('click', ()=>{
    window.location.href = './otherhtmlpages/allproduct.html'
})


// == show and hide  ==
document.getElementById('showMenu').addEventListener('click', showMenu);

document.getElementById('closeMenu').addEventListener('click', closeMenu);

document.getElementById('showSearchBar').addEventListener('click', showSearchBar);

document.getElementById('closeSearchBar').addEventListener('click', closeSearchBar);

function showMenu() {
  let menuList = document.getElementById("hiddenmenuBar");
  menuList.style.display = "block";
}

function closeMenu() {
  let menu = document.getElementById("hiddenmenuBar");
  menu.style.display = "none";
}

function showSearchBar() {
  let searchBar = document.getElementById("searchBar");
  searchBar.style.display = "block";
}

function closeSearchBar() {
  let searchbar = document.getElementById("searchBar");
  searchbar.style.display = "none";
}


//get search items 

const productCollection = ['bestsellers', 'trending', 'eyes'];

async function searchproductByname(searchTerm) {
    const results = [];

    try {
       for (const products of productCollection) {
        const refs = collection(db, products);
        console.log(`Checking collection: ${products}`);
        const snapshot = await getDocs(refs);

        snapshot.forEach((doc)=>{
            const data = doc.data();
            const nameMatch = data.productname?.toLowerCase().includes(searchTerm);
            console.log(nameMatch);
            if (nameMatch) {
                results.push({id: doc.id, ...doc.data()});
            }
        });
       };

    } catch (error) {
        console.log(error);
    };

    return results
}




// get trending
async function getTrending() {

    try {
        const trendingProduct = await getDocs(trendingRef);
        trendingProduct.forEach((doc) => {
            const data2 = { id: doc.id, ...doc.data() };
            trending.push(data2)
        });

        displayTrending();

    } catch (error) {
        console.log(error);
    }
}
// get bestseller
async function getBestsellers() {
    try {
        const product = await getDocs(colRef);

        product.forEach((document) => {
            const data = { id: document.id, ...document.data() }
            console.log(data);
            bestSeller.push(data)

        });

        displayBestSellers();

    } catch (error) {
        console.log(error);

    }
}

window.addTocart = async function (productId) {

    const user = auth.currentUser;
    if (!user) {
        showAlert("Please log in to add items to your cart.");
        return;
    }

    const product = [...bestSeller, ...trending].find(p => p.id === productId);

    if (!product) {
        showAlert("Product not found.");
        return;
    }

    try {
        const cartRef = collection(db, "user", user.uid, "cart");
        const q = query(cartRef, where('productId', '==', product.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            showAlert(`Item is already in cart. <a href='cart.html' style="color:blue;text-decoration:underline;">Click here to view it.</a>`);
        } else {
            // const quantity = 1;
            const subtotal = product.price * product.quantity;

            await addDoc(cartRef, {
                productId: product.id,
                productname: product.productname,
                productdescription: product.productdescription,
                image: product.image, // Keep full array for hover
                price: product.price,
                quantity: product.quantity,
                category: product.category,
                subtotal
            });
            window.updateCartCount();

            showAlert("Added to cart successfully.");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        showAlert("Failed to add to cart.");
    }
};

function displayBestSellers() {
    bestSeller.forEach((product) => {
        container.innerHTML += `


            <div class='box'>
               <a href="./otherhtmlpages/singlepage.html?id=${product.id}">
                 <div class="product-image">
                  <img class="main-img" src="${product.image[0]}" alt="${product.productname}">
                  <img class="hover-img" src="${product.image[1]}" alt="${product.productname}">
                 </div>
                 <div class = 'wrapper'>
                    <p>${product.productname}</p>
                    <p> $ ${product.price}.00 </p>
                 </div>

                </a> 
                <button onclick="addTocart('${product.id}')" class = 'addtocart'>add to cart</button>
            </div>
            `
    })
};

function displayTrending() {
    trending.forEach((products) => {
        trendingContainer.innerHTML += `
 <div class='box'>
                <a href="./otherhtmlpages/singlepage.html?id=${products.id}">
                <img src='${products.image}' class='img-scale'>
                 <div class = 'wrapper'>
                    <p>${products.productname}</p>
                    <p> $ ${products.price}.00 </p>
                 </div>

                </a> 
                <button onclick="addTocart('${products.id}')" class = 'addtocart'>add to cart</button>
            </div>

        `
    })
};


// ==function to display username 

onAuthStateChanged(auth, (user)=>{
  getcurrentUser(user?.uid);

})


async function getcurrentUser(userId) {
    const colRef = collection(db, "user");
    const q = query(colRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((user)=>{
        displayUser(user.data())
    })
}



function displayUser(user) {
    let containers = document.getElementById('displayy');

    containers.innerHTML = 
    `
                <img src="${user.image}" alt="">
                    <p class="username"> ${user.firstname}</p>

    `
    
}

//display search results

function displaySearchResults(searchResult) {
   let searchContainer = document.getElementById('searchContainer') ;
   searchContainer.innerHTML = '';

if (searchResult.length === 0) {
    searchContainer.innerHTML = `<p> no product available</p>`
    return
}
   
searchResult.forEach(product=>{
    searchContainer.innerHTML += `
     <div class="productCard">
        <a href="./otherhtmlpages/singlepage.html?id=${product.id}">
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


//function perfoming the search

document.getElementById('searchTerm').addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
  
    if (searchTerm === '') {
      document.getElementById('searchContainer').innerHTML = '';
      return;
    }
    const results = await searchproductByname(searchTerm);
    displaySearchResults(results);
  });
  


function showAlert(message) {

    alertBox.innerHTML = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000)
}
getTrending();
getBestsellers();

// window.updateCartCount();