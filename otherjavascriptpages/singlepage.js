import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc, query, where, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


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

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const cameFrom = urlParams.get('from')
// const cartRef = collection(db, 'cart', productId)


console.log(productId);

const colRef = doc(db, 'bestsellers', productId);
const trendingRef = doc(db, 'trending', productId);
const backPage = document.getElementById('display');

function backLink(){
 if ( cameFrom === 'bestsellers') {
    backPage.innerHTML = `<a href="index.html#bestsellers">← Back to Bestsellers</a>`
 } else {
    backLinkDiv.innerHTML = `<a href="index.html">← Back to Home</a>`;
 }
}


async function getsingleProduct() {
try {
const docsnapShot = await getDoc(colRef);
if (docsnapShot.exists()) {
    const data = docsnapShot.data();
    const product = {id: docsnapShot.id, ...data};
    displaySingleProduct(product);
}
} catch (error) {
console.log(error);

}
};

async function getsingleTrendingProduct() {
try {
const docsnapshot = await getDoc(trendingRef);
if (docsnapshot.exists()) {
const data = docsnapshot.data();
const trendingProduct = {id: docsnapshot.id, ...data};
displayTrendingProduct(trendingProduct)
}

} catch (error) {
console.log(error);
}
}

function displayTrendingProduct(trendingProduct) {
let container = document.getElementById('containerr');

container.innerHTML = `

<div class="image-wrapperr">
    <img src="${trendingProduct.image}" alt="">
    <p>${trendingProduct.productdescription}</p>
</div>

<div class="product-title">
    <div class="title-wrapper">
        <h1>${trendingProduct.productname}</h1>
        <p> $ ${trendingProduct.price}.00</p>
        <p>${trendingProduct.category}</p>
    </div>

    <div class="quantity-control">
        <button onclick="decreaseQuantity()">-</button>
        <input type="number" id="quantity" value="1" min="1" readonly>
        <button onclick="increaseQuantity()">+</button>
    </div>

    <div class="addtoCart">
        <button class="btn">Add to Cart</button>
        <button class="btn2"><i class="fa-regular fa-heart"></i></button>
    </div>

    <div class="shippin">
        <h1>SHIPPING POLICY</h1>
        <p>Gracia processes orders within 1–2 business days, with standard shipping taking 3–7 business
            days. Tracking is provided for all orders to ensure transparent delivery updates.
            Shipping availability may vary by location; contact support for assistance.</p>
    </div>
</div>
`
}





function createSwiper(imageArray) {
const slides = imageArray.map((image)=>{
 return   `
     <div class="swiper-slide">
<img src="${image}">
</div>
    `
});


return`
<div class="swiper mySwiper">
<div class="swiper-wrapper">
${slides}
</div>
<div class="swiper-pagination"></div>
</div>
`
}
function displaySingleProduct(product) {
let containerr = document.getElementById('containerr');
const swiperHtml = createSwiper(product.image)
containerr.innerHTML = `
<div class="image-wrapperr">
${swiperHtml}
    <p>${product.productdescription}</p>
</div>

<div class="product-title">
    <div class="title-wrapper">
        <h1>${product.productname}</h1>
        <p> $ ${product.price}.00</p>
        <p>${product.category}</p>
    </div>

    <div class="quantity-control">
        <button onclick="decreaseQuantity()">-</button>
        <input type="number" id="quantity" value="1" min="1" readonly>
        <button onclick="increaseQuantity()">+</button>
    </div>

    <div class="addtoCart">
        <button class="btn">Add to Cart</button>
        <button class="btn2"><i class="fa-regular fa-heart"></i></button>
    </div>

    <div class="shippin">
        <h1>SHIPPING POLICY</h1>
        <p>Gracia processes orders within 1–2 business days, with standard shipping taking 3–7 business
            days. Tracking is provided for all orders to ensure transparent delivery updates.
            Shipping availability may vary by location; contact support for assistance.</p>
    </div>
</div>
`;


new Swiper('.mySwiper', {
pagination: {
el: '.swiper-pagination',
clickable: true,
},
});
}

function showSearchBar() {
    let searchBar = document.getElementById('searchBar');
    searchBar.style.display = 'block';
}
function closeSearchBar() {
    let searchbar = document.getElementById('searchBar');
    searchbar.style.display = 'none';
}

function showMenu() {
    let menuList = document.getElementById('hiddenMenuBar');
    menuList.style.visibility = 'visible';
}

function closeMenu() {
    let menu = document.getElementById('hiddenMenuBar');
    menu.style.visibility = 'hidden';
}


//email.js 

newsletter.addEventListener('submit', async (e) => {
    e.preventDefault()
    let emails = document.getElementById('email').value;


    const q = query(newsletterRef, where('email', '==', emails));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        showAlert('email already registered');
        return
    }
    try {
        await addDoc(newsletterRef, { email: emails });
        const response = await emailjs.sendForm('service_vbjomvt', 'template_pzgjgqe', '#newsletter');

        showAlert('subscribed sucesssful');
newsletter.reset(); 
    } catch (error) {
        console.log(error);

    }
});

function showAlert(message) {

    alertBox.innerHTML = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000)
};

getsingleProduct();
getsingleTrendingProduct();