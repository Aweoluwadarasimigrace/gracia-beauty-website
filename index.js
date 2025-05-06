import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getFirestore, getDocs, collection, addDoc, query, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


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
        const newsletterRef = collection(db, 'newsletter');

        const cartRef = collection(db, 'cart')
        const colRef = collection(db, 'bestsellers');

        const trendingRef = collection(db, 'trending');

        const trending = [];

        const bestSeller = [];
        let container = document.getElementById('container');
        let trendingContainer = document.getElementById('trendingContainer');
        let newsletter = document.getElementById('newsletter');

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
            try {
                const product = bestSeller.find((products) => products.id === productId)
                await addDoc(cartRef, {
                    image: product.image,
                    productId: product.id,
                    productname: product.productname,
                    productdescription: product.productdescription,
                    price: product.price
                })
                showAlert('added to cart succesfully')
            } catch (error) {
                console.log(error);

            }

        }
        // addd to carttrending

        window.addToCart = async function (productId) {
            try {
                const products = trending.find((product) => product.id === productId)
                await addDoc(cartRef, {
                    image: products.image,
                    productdescription: products.productdescription,
                    productname: products.productname,
                    price: products.price,
                    productId: products.id
                })

                showAlert('added to cart successfully')
            } catch (error) {
                console.log(error);

            }
        }



        function displayBestSellers() {
            bestSeller.forEach((product) => {
                container.innerHTML += `


            <div class='box'>
               <a href="./otherhtmlpages/singlepage.html?id=${product.id}&cameFrom = bestsellers">
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