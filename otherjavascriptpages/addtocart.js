import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc, query, where, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    getAuth
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";



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
let cartArray = [];


onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const colRef = collection(db, 'user', user.uid, 'cart');
            const querySnapshot = await getDocs(colRef);
            cartArray = [];
            querySnapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                // const data = doc.data()
                console.log(data);
                cartArray.push(data);
            });
            console.log(cartArray);  // Debugging
            displayCart(user.uid);
        } catch (error) {
            console.log(error);
        }
    } else {
        const emptyMessage = document.getElementById('empty');
        showAlert('user not logged in');
           emptyMessage.style.display = 'block';
    }
})


function displayCart(userId) {
    const container = document.getElementById('cartContainer');
    const emptyMessage = document.getElementById('empty');
    const cartHeader = document.getElementById('cart-header');

    // Toggle visibility based on cart content
    if (cartArray.length === 0) {
        cartHeader.style.visibility = 'hidden';
        emptyMessage.style.display = 'block';
        return;
    } else {
        cartHeader.style.visibility = 'visible';

        const totalitems = document.getElementById('totalitems')
        totalitems.style.visibility = 'visible'
        // or 'flex' depending on your layout
        emptyMessage.style.display = 'none';
    }
    container.innerHTML = ''; // Clear old items before appending new ones
    let subtotal = 0;
    cartArray.forEach((product, index) => {
        subtotal += product.subtotal || (product.price * product.quantity)
        container.innerHTML +=

            `

           <tr class="cart-item" data-index="${index}">
  <td>
    <i class="fa-solid fa-trash deletebtn"></i>
  </td>
  <td>
    <a href="./singlepage.html?id=${product.productId}" class="a">
      <div class="item-details">
        <img src="${product.image}" class="product-image" alt="${product.productname}">
          <div> <h3 class="name">${product.productname}</h3>
          <p>category: ${product.category}</p>
        </div>
      </div>
    </a>
  </td>
  <td class="price">$${product.price}.00</td>
  <td>
    <div class="quantity-control">
    <button class="decreaseBtn">-</button>
    <input type="number" class="quantity" value="${product.quantity}" min="1" readonly>
    <button class="increaseBtn">+</button>
    </div>

  </td>
  <td class="subtotal">
    <p>$${product.subtotal}.00</p>
  </td>
</tr>
           `
            ;
    });


    let tax = 200;
    let total = subtotal + tax;

    const displaySubtotal = document.getElementById('displaySubtotal')

    displaySubtotal.innerHTML = `$${subtotal}.00`;
    const displayTax = document.getElementById('displayTax');

    displayTax.innerHTML = `$${tax}.00`;
    const displaytotal = document.getElementById('displaytotal');
    displaytotal.innerHTML = `$${total}.00`


    // Attach event listeners
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach((item) => {
        const increaseBtn = item.querySelector('.increaseBtn');
        const decreaseBtn = item.querySelector('.decreaseBtn');
        const quantityInput = item.querySelector('.quantity');
        const subtotalDisplay = item.querySelector('.subtotal');
        const deleteBtn = item.querySelector('.deletebtn');

        const index = parseInt(item.dataset.index);

        deleteBtn.addEventListener('click', async () => {
            try {
                const productId = cartArray[index].id;
                const cartRef = doc(db, 'user', userId, 'cart', productId);
                await deleteDoc(cartRef)
                cartArray.splice(index, 1);
                displayCart(userId); // Re-render UI
                window.updateCartCount();

            } catch (error) {
                console.log(error);

            }
        });

        increaseBtn.addEventListener('click', async () => {
            cartArray[index].quantity++;
            quantityInput.value = cartArray[index].quantity;
            cartArray[index].subtotal = cartArray[index].quantity * cartArray[index].price
            subtotalDisplay.textContent = `$${cartArray[index].subtotal} .00`
            await updatecartQuantity(userId, cartArray[index].id, cartArray[index].quantity, cartArray[index].price, cartArray[index].subtotal);
        });

        decreaseBtn.addEventListener('click', async () => {
            if (cartArray[index].quantity > 1) {
                cartArray[index].quantity--;
                quantityInput.value = cartArray[index].quantity;
                cartArray[index].subtotal = cartArray[index].quantity * cartArray[index].price
                subtotalDisplay.textContent = `$${cartArray[index].subtotal} .00`
                await updatecartQuantity(userId, cartArray[index].id, cartArray[index].quantity, cartArray[index].price, cartArray[index].subtotal);
            } else {
                showAlert('invalid operation')
            }
        });
    });
}




async function updatecartQuantity(docId, quantity, price, subtotal, userId) {
    const cartRef = doc(db, 'user', userId, 'cart', docId);
    displayCart()
    try {
        await updateDoc(cartRef, {
            quantity,
            price,
            subtotal
        });
        showAlert('Cart Updated');
    } catch (error) {
        console.log(error);
    }
}





const productCollection = ['bestsellers', 'trending', 'face', 'eyes'];

async function searchproductByname(searchTerm) {
    const results = [];

    try {
        for (const products of productCollection) {
            const refs = collection(db, products);
            const snapshot = await getDocs(refs);
            snapshot.forEach((doc) => {
                const data = doc.data();
                const nameMatch = data.productname?.toLowerCase().includes(searchTerm);
                if (nameMatch) {
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
    }, 2000);
}

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

// ==function to display username 

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