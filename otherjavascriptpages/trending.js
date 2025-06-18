import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  getDocs,
  collection,
  addDoc, query, where, updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
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
const auth = getAuth(app);
const colRef = collection(db, "trending");
const array = []
async function geteyesProduct() {
    try {
        const snapshot = await getDocs(colRef);
        snapshot.forEach(product =>{
            const data = {id:product.id, ...product.data()};
            array.push(data)
            displayproduct()
        });
        loaderr.style.display = 'none';
        loader.style.display = 'none'
        loader.hidden = true
        footer.hidden = false
        news.hidden = false
        header.style.visibility = 'visible'
        head.hidden = false
        section.style.visibility = "visible"
        hiddenproductDisplay.style.visibility = "visible"
      console.log(array);
      // displayproduct()

    } catch (error) {
        console.log(error)
    }
}





function displayproduct() {
    document.getElementById("showing").innerHTML = `showing ${array.length} results`
      let container = document.getElementById("display1");
      container.innerHTML = '';
      array.forEach((product) => {
        container.innerHTML += `
        <div class='box'>
                        <a href="./singlepage.html?id=${product.id}">
                        <img src='${product.image}' class='img-scale'>
                         <div class = 'wrapper'>
                            <p>${product.productname}</p>
                             <p class = "category"> ${product.category}</p>
                            
                            <p> $ ${product.price}.00 </p>
                         </div>
                        </a> 
                        <button onclick="addTocart('${product.id}')" class = 'addtocart'>add to cart</button>
                    </div>
          `
      })
    
    
    
    };
    
window.addTocart = async function (productId) {
  const user = auth.currentUser;

  if (!user) {
    showAlert("please log in to aadd items to your cart");
    return;
  }

  const product = array.find(p => p.id === productId)

  if (!product) {
    showAlert("product not found")
    return;
  }


  try {
    const cartRef = collection(db, "user", user.uid, "cart");
    const normalizedName = product.productname.trim().toLowerCase();
    console.log(normalizedName);

    // Check if a product with the same name is already in the cart
    const q = query(cartRef, where("normalizedName", "==", normalizedName));
    // const q = query(cartRef, where("productId", "==", product.id));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)

    if (!querySnapshot.empty) {
      showAlert(`Item is already in cart. <a href='cart.html' style="color:blue;text-decoration:underline;">Click here to view it.</a>`);
    } else {
      const subtotal = product.price * product.quantity;

      await addDoc(cartRef, {
        productId: product.id,
        productname: product.productname,
        productdescription: product.productdescription,
        normalizedName: normalizedName,
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

    console.log(error)
  }
}


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


const productCollection = ['bestsellers', 'trending', 'eyes', 'lipgloss product', 'faceproduct'];


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



onAuthStateChanged(auth, (user) => {
  if (user) {
    log.style.display = 'none';
    let display = document.getElementById('displayy');
    display.classList.add('auth-visible');
    getcurrentUser(user?.uid);

  }
  else {
    display.classList.remove('auth-visible');
  }
})


async function getcurrentUser(userId) {
  const colRef = collection(db, "user");
  const q = query(colRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((user) => {
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

//display search results

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
  }, 2000)
}

geteyesProduct()