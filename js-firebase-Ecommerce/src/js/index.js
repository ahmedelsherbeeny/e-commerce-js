

import '../css/index.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../js/navbar.js'


import {
    DB, collection, getDocs, getDoc, doc, query, where

} from "./firebase.js";

import eLogo from '../images/e-logo.jpg';

const productDocRef = collection(DB, "products");




async function getProductData() {
    try {
        const querySnapshot = await getDocs(productDocRef);
        const productDataArray = [];
        querySnapshot.forEach(doc => {
            const productData = doc.data();
            productDataArray.push(productData);
        });
        return productDataArray;
    } catch (error) {
        throw new Error('Error retrieving product documents:', error);
    }
}

function updateCartCounter(value) {
    const counter = document.querySelector('.cart .counter');
    counter.textContent = value;
}

// Initialize or get existing cart data from local storage
let cartData = JSON.parse(localStorage.getItem('cart')) || {
    products: [],
    totalQuantity: 0
};

// Function to update the cart data in local storage
function updateCartData() {
    localStorage.setItem('cart', JSON.stringify(cartData));
}

// Function to add a product to the cart data
function addToCart(productData, quantity) {
    // Check if the product already exists in the cart
    const existingProduct = cartData.products.find(item => item.productId === productData.id);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        // If the product is not in the cart, add it
        cartData.products.push({
            productId: productData.id,
            name: productData.name,
            price: productData.price,
            quantity: quantity
        });
    }
    // Update total quantity
    cartData.totalQuantity += quantity;
    // Update cart data in local storage
    cartData.products = cartData.products.filter(product => product.quantity > 0);


    if (cartData.totalQuantity === 0) {
        localStorage.removeItem("cart")
    } else {

        updateCartData();
    }
    updateCartDisplay(cartData);

}



// update cart in offcanvas
function updateCartDisplay(cartData) {
    const offcanvasBody = document.querySelector('#offcanvasRight .offcanvas-body');
    offcanvasBody.innerHTML = ''; // Clear previous content

    if (cartData.products.length === 0) {
        offcanvasBody.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cartData.products.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center');
        cartItem.innerHTML = `
            <div class="item-details">
                <h5 class="mb-0"><span class="math-inline">${product.name}</h5\>
<span class\="price"\>€</span>${product.price}</span>
            </div>
            <div class="quantity-controls d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-warning minus">-</button>
                <span class="quantity">${product.quantity}</span>
                <button class="btn btn-sm btn-warning plus">+</button>
            </div>
        `;

        // Event listeners for quantity buttons
        const quantityDisplay = cartItem.querySelector('.quantity');
        const minusButton = cartItem.querySelector('.minus');
        const plusButton = cartItem.querySelector('.plus');

        minusButton.addEventListener('click', () => {
            let quantity = parseInt(quantityDisplay.textContent);
            quantity = quantity - 1
            if (quantity >= 1) {
                quantityDisplay.textContent = quantity;
                product.quantity = quantity;
                cartData.totalQuantity -= 1;
                updateCartCounter(cartData.totalQuantity);
                updateCartData(cartData); // Update cartData in local storage


            } else {
                cartItem.remove(); // Remove item from cart display if quantity reaches 0
                product.quantity = 0; // Update product quantity in cartData
                cartData.products = cartData.products.filter(product => product.quantity > 0);
                cartData.totalQuantity -= 1;
                updateCartData(cartData); // Update cartData in local storage
                updateCartCounter(cartData.totalQuantity);


            }
        });

        plusButton.addEventListener('click', () => {
            let quantity = parseInt(quantityDisplay.textContent);
            quantity++;
            quantityDisplay.textContent = quantity;
            product.quantity = quantity;
            cartData.totalQuantity += 1;
            updateCartData(cartData); // Update cartData in local storage

            updateCartCounter(cartData.totalQuantity);

        });

        offcanvasBody.appendChild(cartItem);
    });
}









// async function displayProductCards() {
//     try {
//         const productDataArray = await getProductData();
//         let div = document.getElementById('prods');
//         productDataArray.forEach(productData => {
//             // Create a new card element for each product
//             let card = document.createElement('div');
//             card.classList.add('card');
//             card.innerHTML = `
//                 <div class="imgBox">
//                     <img src="data:image/png;base64,${productData.image}" alt="Product Image">
//                 </div>
//                 <div class="contentBox">
//                     <h3 class="">${productData.name}</h3>
//                     <h2 class="price">${productData.price}.<small>98</small> €</h2>
//                     <h2 class="price"> Available: ${productData.available}</h2>

//                         <div  class="brand">${productData.brand}</div>

//                 </div>
//             `;

//             div?.appendChild(card);
//         });
//     } catch (error) {
//         console.error(error?.message);
//     }
// }




async function displayProductCards() {
    try {
        // Get product data array from Firebase
        const productDataArray = await getProductData();

        const productDetailsDiv = document.getElementById('prods');

        productDataArray.forEach(productData => {
            // Create a new card element for each product
            const card = document.createElement('div');
            card.classList.add('card');

            // Event listener for product click
            card.addEventListener('click', async () => {
                const productId = productData.id; // Assuming "id" property holds product ID

                // Check if local storage already has product details
                // const existingProductDetails = localStorage.getItem(`product-${productId}`);

                // // Retrieve product details from Firebase if not in local storage
                // let detailedProductData;
                // if (!existingProductDetails) {
                //     detailedProductData = await getProductById(productId);
                //     console.log(detailedProductData);
                //     localStorage.setItem(`product-${productId}`, JSON.stringify(detailedProductData));
                // } else {
                //     detailedProductData = JSON.parse(existingProductDetails);
                // }

                // Navigate to product-details.html with product data
                window.location.href = `product-details.html?productId=${productId}`;
            });

            card.innerHTML = `
          <div class="imgBox">
            <img src="data:image/png;base64,${productData.image}" alt="Product Image">
          </div>
          <div class="contentBox">
            <h3 class="">${productData.name}</h3>
            <h2 class="price">${productData.price}.<small>98</small> €</h2>
            <h2> Available: ${productData.available}</h2>
            <div class="brand">${productData.brand}</div>
          </div>
        `;

            productDetailsDiv?.appendChild(card);
        });
    } catch (error) {
        console.error(error?.message);
    }
}




// async function getProductById(productId) {
//     try {
//         const productQuery = query(collection(DB, "products"), where("id", "==", productId));
//         const querySnapshot = await getDocs(productQuery);

//         if (querySnapshot.empty) {
//             console.warn(`Product with ID ${productId} not found in Firebase.`);
//             return null; // Or handle the case where product is not found
//         }

//         // Assuming only one document matches the ID (handle multiple matches if needed)
//         const productData = querySnapshot.docs[0].data();
//         return productData;
//     } catch (error) {
//         console.error("Error fetching product by ID:", error);
//         return null; // Or handle the error appropriately
//     }
// }

document.addEventListener('DOMContentLoaded', function () {
    // Call the function to display product cards
    displayProductCards();
    // Initialize cart counter with total quantity from cart data
    updateCartCounter(cartData.totalQuantity);
});



export { getProductData }




























