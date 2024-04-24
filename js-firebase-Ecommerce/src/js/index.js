

import '../css/index.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../js/navbar.js'


import {
    DB, collection, getDocs

} from "./firebase.js";

import eLogo from '../images/e-logo.jpg';

const productDocRef = collection(DB, "products");



// async function getProductData() {
//     try {
//         const querySnapshot = await getDocs(productDocRef);

//         const productDataArray = [];

//         querySnapshot.forEach(doc => {
//             const productData = doc.data();
//             productDataArray.push(productData);
//         });

//         return productDataArray;
//     } catch (error) {
//         throw new Error('Error retrieving product documents:', error);
//     }
// }


// function updateCartCounter(value) {
//     const counter = document.querySelector('.cart .counter');
//     counter.textContent = value;

// }


// // Function to handle the click event on the "Buy Now" button
// function handleBuyButtonClick(card) {

//     // Hide the "Buy Now" button
//     const buyNowButton = card.querySelector('.buy');
//     buyNowButton.style.display = 'none';

//     // Create the plus button
//     const plusButton = document.createElement('button');
//     plusButton.textContent = '+';
//     plusButton.classList.add('quantity-btn', 'plus', 'btn', 'btn-warning', 'btn-sm');
//     card.querySelector('.actions').appendChild(plusButton);

//     // Create the quantity display
//     const quantityDisplay = document.createElement('span');
//     quantityDisplay.textContent = '1';
//     quantityDisplay.classList.add('quantity-display');
//     card.querySelector('.actions').appendChild(quantityDisplay);

//     // Create the minus button
//     const minusButton = document.createElement('button');
//     minusButton.textContent = '-';
//     minusButton.classList.add('quantity-btn', 'minus', 'btn', 'btn-warning', 'btn-sm');
//     card.querySelector('.actions').appendChild(minusButton);

//     // Event listener for the plus button
//     plusButton.addEventListener('click', () => {
//         let quantity = parseInt(quantityDisplay.textContent);
//         quantity++;
//         quantityDisplay.textContent = quantity;
//         updateCartCounter(parseInt(document.querySelector('.cart .counter').textContent) + 1);
//     });

//     // Event listener for the minus button
//     minusButton.addEventListener('click', () => {
//         let quantity = parseInt(quantityDisplay.textContent);
//         if (quantity > 1) {
//             quantity--;
//             quantityDisplay.textContent = quantity;
//             updateCartCounter(parseInt(document.querySelector('.cart .counter').textContent) - 1);
//         } else {
//             // If quantity becomes zero, display the "Buy Now" button again
//             plusButton.remove();
//             minusButton.remove();
//             quantityDisplay.remove();
//             buyNowButton.style.display = 'inline-block';
//             updateCartCounter(parseInt(document.querySelector('.cart .counter').textContent) - 1);
//         }
//     });
// }


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
//                 <h3 class="">
//                 ${productData.name}

//                 </h3>
//                 <h2 class="price">${productData.price}.<small>98</small> €</h2>
//                 <h2 class="price"> Available: ${productData.available}</h2>

//                 <div class="actions d-flex justify-content-center align-items-center gap-1 mt-2">

//                 <a href="#" class="buy">Buy Now</a>
//                 </div>
//                 </div>
//             `;
//             // Event listener for the "Buy Now" button
//             const buyNowButton = card.querySelector('.buy');
//             buyNowButton.addEventListener('click', () => {
//                 handleBuyButtonClick(card);
//                 updateCartCounter(parseInt(document.querySelector('.cart .counter').textContent) + 1)
//             });
//             // Append the created card to the container
//             div?.appendChild(card);
//         });

//     } catch (error) {
//         console.error(error?.message);
//     }
// }

// document.addEventListener('DOMContentLoaded', function () {
//     // Call the function to display product cards
//     displayProductCards();
// });


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
    updateCartData();
}

// Function to handle the click event on the "Buy Now" button
function handleBuyButtonClick(card, productData) {
    // Hide the "Buy Now" button
    const buyNowButton = card.querySelector('.buy');
    buyNowButton.style.display = 'none';

    // Create the plus button
    const plusButton = document.createElement('button');
    plusButton.textContent = '+';
    plusButton.classList.add('quantity-btn', 'plus', 'btn', 'btn-warning', 'btn-sm');
    card.querySelector('.actions').appendChild(plusButton);

    // Create the quantity display
    const quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = '1';
    quantityDisplay.classList.add('quantity-display');
    card.querySelector('.actions').appendChild(quantityDisplay);

    // Create the minus button
    const minusButton = document.createElement('button');
    minusButton.textContent = '-';
    minusButton.classList.add('quantity-btn', 'minus', 'btn', 'btn-warning', 'btn-sm');
    card.querySelector('.actions').appendChild(minusButton);

    // Event listener for the plus button
    plusButton.addEventListener('click', () => {
        let quantity = parseInt(quantityDisplay.textContent);
        quantity++;
        quantityDisplay.textContent = quantity;
        addToCart(productData, 1); // Add 1 to cart when plus button is clicked
        updateCartCounter(cartData.totalQuantity);
    });

    // Event listener for the minus button
    minusButton.addEventListener('click', () => {
        let quantity = parseInt(quantityDisplay.textContent);
        if (quantity > 1) {

            quantity--
            console.log(quantity);
            quantityDisplay.textContent = quantity;
            // Decrease 1 from cart when minus button is clicked
            addToCart(productData, -1);
            updateCartCounter(cartData.totalQuantity);
        } else {
            console.log(quantity);
            // If quantity becomes zero, display the "Buy Now" button again
            plusButton.remove();
            minusButton.remove();
            quantityDisplay.remove();
            buyNowButton.style.display = 'inline-block';
            updateCartCounter(cartData.totalQuantity);
        }
    });
}

async function displayProductCards() {
    try {
        const productDataArray = await getProductData();
        let div = document.getElementById('prods');
        productDataArray.forEach(productData => {
            // Create a new card element for each product
            let card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="imgBox">
                    <img src="data:image/png;base64,${productData.image}" alt="Product Image">
                </div>
                <div class="contentBox">
                    <h3 class="">${productData.name}</h3>
                    <h2 class="price">${productData.price}.<small>98</small> €</h2>
                    <h2 class="price"> Available: ${productData.available}</h2>
                    <div class="actions d-flex justify-content-center align-items-center gap-1 mt-2">
                        <a href="#" class="buy">Buy Now</a>
                    </div>
                </div>
            `;
            // Event listener for the "Buy Now" button
            const buyNowButton = card.querySelector('.buy');
            buyNowButton.addEventListener('click', () => {
                handleBuyButtonClick(card, productData);
                addToCart(productData, 1); // Add product to cart when "Buy Now" button is clicked
                updateCartCounter(cartData.totalQuantity);
            });
            // Append the created card to the container
            div?.appendChild(card);
        });
    } catch (error) {
        console.error(error?.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Call the function to display product cards
    displayProductCards();
    // Initialize cart counter with total quantity from cart data
    updateCartCounter(cartData.totalQuantity);
});



export { getProductData }





























