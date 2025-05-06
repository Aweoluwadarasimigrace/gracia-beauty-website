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
const cameFrom = urlParams.get('from');

// const cartRef = collection(db, 'cart', productId)


console.log(productId);

const colRef = doc(db, 'bestsellers', productId);
const trendingRef = doc(db, 'trending', productId);
const relatedRef = collection(db, 'bestsellers');
const backPage = document.getElementById('display');
const trendingRelatedRef = collection(db, 'trending');
let bestSeller = [];
let trending = [];



function backLink() {
    if (cameFrom === 'bestsellers') {
        backPage.innerHTML = `<a href="index.html#bestsellers">Back to Bestsellers</a>`
    } else {
        backPage.innerHTML = `<a href="../index.html">Back to Home</a>`;
    }
};
backLink();

async function getBestsellerProduct() {
    try {
        const docsnapShot = await getDoc(colRef);
        if (docsnapShot.exists()) {
            const data = docsnapShot.data();
            const bestsellerProduct = { id: docsnapShot.id, ...data };
            bestSeller.push(bestsellerProduct);
            displaybestsellerProduct(bestSeller);
            getRelatedBestsellerproduct(bestSeller);
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
            const trendingProduct = { id: docsnapshot.id, ...data };
            trending.push(trendingProduct)
            displayTrendingProduct(trending);
            getRelatedTrendingproduct(trending)
        }

    } catch (error) {
        console.log(error);
    }
}


async function getSingleRelatedProducts() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productRef = doc(db, 'bestSellers', productId);

    try {
        const docsnapshot = await getDoc(productRef)
        if (docsnapshot.exists()) {
            const data = docsnapshot.data();
            const product = { id: docsnapshot.id, ...data };

            displayTrendingProduct(product);
            getRelatedBestsellerproduct(product);
            displayRelatedProduct(product);
        }
    } catch (error) {
        console.log(error);

    }
}

getSingleRelatedProducts();

async function getRelatedBestsellerproduct(currentProduct) {
    const q = query(relatedRef, where('category', '==', currentProduct.category))

    try {
        const querySnapshot = await getDocs(q);
        let relatedProduct = [];

        querySnapshot.forEach(doc => {
            if (doc.id !== currentProduct.id) {
                const data = { id: doc.id, ...doc.data() }
                relatedProduct.push(data);
            }
        });
        displayRelatedProduct(relatedProduct.slice(0, 3))
    } catch (error) {
        console.log(error);

    }
};

async function getRelatedTrendingproduct(currentProduct) {
    const q = query(trendingRelatedRef, where('category', '==', currentProduct.category));
    try {
        const querySnapshot = await getDocs(q);
        let relatedTrendingProduct = [];
        querySnapshot.forEach(docs => {
            if (docs.id !== currentProduct.id) {
                const data = { id: docs.id, ...docs.data() };
                relatedTrendingProduct.push(data);
            }
        });
        displayTrendingRelatedProduct(relatedTrendingProduct.slice(0, 3))

    } catch (error) {
        console.log(error);

    }

};



function displayRelatedProduct(bestSellerproduct) {
    let box = document.getElementById('youmightalsolike');
    bestSellerproduct.forEach((products) => {
        box.innerHTML += `
        <div class = 'box'>
    <a href="./singlepage.html?id=${products.id}&cameFrom = bestseller">
                <img src='${products.image}' class='img-scale'>
                 <div class = 'wrapper'>
                    <p>${products.productname}</p>
                    <p> $ ${products.price}.00 </p>
                 </div>
                </a> 
        </div>
    
        `
    })

};



function displayTrendingRelatedProduct(products) {
    let box = document.getElementById('youmightalsolike');
    products.forEach((product) => {
        box.innerHTML += `
        <div class = 'box'>
    <a href="./singlepage.html?id=${product.id}&cameFrom = bestseller">
                <img src='${product.image}' class='img-scale'>
                 <div class = 'wrapper'>
                    <p>${product.productname}</p>
                    <p> $ ${product.price}.00 </p>
                 </div>
                </a> 
        </div>

        `
    })
};

function displayTrendingProduct(trendingProduct) {
    let container = document.getElementById('containerr');
    trendingProduct.forEach((trendingProduct) => {
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
    })

};





function createSwiper(imageArray) {
    const slides = imageArray.map((image) => {
        return `
    <div class="swiper-slide">
       <img src="${image}">
    </div>
    `
    });


    return `
    <div class="swiper mySwiper">
      <div class="swiper-wrapper">
         ${slides}
       </div>
       <div class="swiper-pagination"></div>
    </div>
`
}



function displaybestsellerProduct(product) {
    let containerr = document.getElementById('containerr');
    const swiperHtml = createSwiper(product.image);

    product.forEach((product) => {
        containerr.innerHTML = `
        <div class="image-wrapperr">
            ${swiperHtml}
           <p>${product.productdescription}</p>
        </div>
    
       <div class="product-title">
          <div class="title-wrapper">
            <h1>${product.productname}</h1>
            <p class ='price'> $ ${product.price}.00</p>
            <p class = 'category'>Category: ${product.category}</p>
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
    })
        ;


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

getBestsellerProduct();
getsingleTrendingProduct();
