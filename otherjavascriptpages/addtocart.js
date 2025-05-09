import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc, query, where, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


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

const colRef = collection(db, 'cart');
let cartArray = [];

async function getCart() {
    try {
        const querySnapshot = await getDocs(colRef);
        querySnapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            cartArray.push(data);
        });
        console.log(cartArray);  // Debugging
        displayCart();
    } catch (error) {
        console.log(error);
    }
}
function displayCart() {
    // let container = document.getElementById('cart-container');
    const container = document.getElementById('cartContainer');
    // const container = document.getElementById('cart-container');
    const emptyMessage = document.getElementById('empty');
    const cartHeader = document.getElementById('cart-header');

    // Toggle visibility based on cart content
    if (cartArray.length === 0) {
        cartHeader.style.visibility = 'hidden';
        emptyMessage.style.display = 'block';
        return;
    } else {
        cartHeader.style.visibility = 'visible'; // or 'flex' depending on your layout
        emptyMessage.style.display = 'none';
    }
    container.innerHTML = ''; // Clear old items before appending new ones

    cartArray.forEach((product, index) => {
        container.innerHTML += 
        
            `<div class="cart-item" data-index="${index}">
                <a href="./singlepage.html?id=${product.id}&cameFrom=cart" class = 'a'>
                    <div class="flex-cart">
                      <i class="fa-solid fa-trash deletebtn"></i>
                        <div class="item-details">
                          <img src="${product.image}" class="product-image" alt="${product.productname}">
                            <h3 class= 'name'>${product.productname}</h3>
                        </div>
                    </div>
                </a>
                 <p class="price">$${product.price}.00</p>
                <div class="quantity-control">
                    <button class="decreaseBtn">-</button>
                    <input type="number" class="quantity" value="${product.quantity}" min="1" readonly>
                    <button class="increaseBtn">+</button>
                </div>
                <div class="subtotal">
                    <p>$${product.price * product.quantity}.00</p>
                </div>
            </div>`
        ;
    });

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
            const productId = cartArray[index].id;
            cartArray.splice(index, 1);
            await deleteCart(productId); // Optional: if using Firebase
            displayCart(); // Re-render UI
        });

        increaseBtn.addEventListener('click', async () => {
            cartArray[index].quantity++;
            quantityInput.value = cartArray[index].quantity;
            subtotalDisplay.textContent = cartArray[index].quantity * cartArray[index].price;
            await updatecartQuantity(cartArray[index].id, cartArray[index].quantity, cartArray[index].price);
        });

        decreaseBtn.addEventListener('click', async () => {
            if (cartArray[index].quantity > 1) {
                cartArray[index].quantity--;
                quantityInput.value = cartArray[index].quantity;
                subtotalDisplay.textContent = cartArray[index].quantity * cartArray[index].price;
                await updatecartQuantity(cartArray[index].id, cartArray[index].quantity, cartArray[index].price, cartArray[index].subtotal);
            } else {
                const productId = cartArray[index].id;
                // cartArray.splice(index, 1);
                await deleteCart(productId);
                displayCart(); // Refresh
            }
        });
    });
}




async function deleteCart(docId) {
    try {
        const cartRef = doc(db, 'cart', docId);
        await deleteDoc(cartRef);
        showAlert('deleted from cart')
    } catch (error) {
        console.log(error);

    }
};




async function updatecartQuantity(docId, quantity, price) {
    const cartRef = doc(db, 'cart', docId);
const subtotal = parseInt(price * quantity);
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

getCart();

function showAlert(message) {
    alertBox.innerHTML = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000);
}
