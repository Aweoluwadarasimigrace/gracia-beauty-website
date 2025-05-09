// Firebase & EmailJS Integration

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc, query, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// EmailJS Library
import * as emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

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

// Firestore Collections
const newsletterRef = collection(db, 'newsletter');
const cartRef = collection(db, 'cart');
const colRef = collection(db, 'bestsellers');
const trendingRef = collection(db, 'trending');
const trending = [];
const bestSeller = [];
let container = document.getElementById('container');
let trendingContainer = document.getElementById('trendingContainer');
// HTML Elements
const newsletterForm = document.getElementById('newsletter');
const shopbestseller = document.getElementById('shopBestseller');

// Initialize EmailJS

// emailjs.init('8EE44vqqd4TnnSdiU'); 

// Newsletter Form Submission Handler
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;

    // Check if email already exists in the Firestore
    const q = query(newsletterRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        showAlert('Email already registered');
        return;
    }

    // Add email to the newsletter collection and send confirmation via EmailJS
    try {
        await addDoc(newsletterRef, { email });
        await emailjs.sendForm('service_vbjomvt', 'template_pzgjgqe', '#newsletter');
        showAlert('Subscribed successfully');
        newsletterForm.reset(); // Reset the form
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
    }
});

// Redirect user to Bestsellers page
shopbestseller.addEventListener('click', () => {
    window.location.href = "./otherhtmlpages/bestselller.html";
});








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
// add to cart for bestseller
window.addTocart = async function (productId) {
    const product = bestSeller.find((products) => products.id === productId)
    try {
        const q = query(cartRef, where('productId', '==', product.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {

            const docToupdate = querySnapshot.docs[0];
            const newQuantity = docToupdate.data().quantity || 1;
            const cartref = doc(db, 'cart', docToupdate.id);

            await updateDoc(cartref, {
                quantity: newQuantity + 1
            });
// alert('added')
            showAlert('updatedCart Sucessful')
        } 
        
        else {
            await addDoc(cartRef, {
                image: product.image,
                productId: product.id,
                productname: product.productname,
                productdescription: product.productdescription,
                price: product.price,
                quantity: product.quantity
            });
            showAlert('added to cart succesfully')
        }

    } catch (error) {
        console.log(error);

    }

}
// addd to carttrending

window.addToCart = async function (productId) {

    const products = trending.find((product) => product.id === productId);
    try {

        const q = query(cartRef, where('productId', '==', products.id));
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
            const docToupdate = querySnapshot.docs[0];
            const newQuantity = docToupdate.data().quantity || 1;
            const cartref = doc(db, 'cart', docToupdate.id)

            await updateDoc(cartref, {
                quantity: newQuantity + 1
            });
            showAlert('already in cart')
        }
        else {
            await addDoc(cartRef, {
                image: products.image,
                productdescription: products.productdescription,
                productname: products.productname,
                price: products.price,
                productId: products.id,
                quantity: products.quantity
            })

            showAlert('added to cart successfully')
        }
    } catch (error) {
        console.log(error);

    }
}



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
                <a href="./otherhtmlpages/singlepage.html?id=${products.id}&cameFrom = trending">
                <img src='${products.image}' class='img-scale'>
                 <div class = 'wrapper'>
                    <p>${products.productname}</p>
                    <p> $ ${products.price}.00 </p>
                 </div>

                </a> 
                <button onclick="addToCart('${products.id}')" class = 'addtocart'>add to cart</button>
            </div>

        `
    })
}
function showAlert(message) {

    alertBox.innerHTML = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000)
}
getTrending();
getBestsellers();