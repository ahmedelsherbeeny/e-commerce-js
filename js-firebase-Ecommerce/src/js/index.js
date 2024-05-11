

import '../css/index.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../js/navbar.js'


import {
    DB, collection, getDocs

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


    if(cartData.totalQuantity ===0){
        localStorage.removeItem("cart")
    }else{

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
            quantity=quantity-1
            if (quantity >= 1) {
                quantityDisplay.textContent = quantity;
                product.quantity = quantity;
                cartData.totalQuantity -=1;
                updateCartCounter(cartData.totalQuantity);
                updateCartData(cartData); // Update cartData in local storage


            } else {
                cartItem.remove(); // Remove item from cart display if quantity reaches 0
                product.quantity = 0; // Update product quantity in cartData
                updateCartData(cartData); // Update cartData in local storage
            }
        });

        plusButton.addEventListener('click', () => {
            let quantity = parseInt(quantityDisplay.textContent);
            quantity++;
            quantityDisplay.textContent = quantity;
            product.quantity = quantity;
            cartData.totalQuantity +=1;
            updateCartData(cartData); // Update cartData in local storage

            updateCartCounter(cartData.totalQuantity);

        });

        offcanvasBody.appendChild(cartItem);
    });
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
        updateCartDisplay(cartData)
        
        

    });

    // Event listener for the minus button
    minusButton.addEventListener('click', () => {
        let quantity = parseInt(quantityDisplay.textContent);
        quantity=quantity-1
        if (quantity >= 1) {

            quantityDisplay.textContent = quantity;
            // Decrease 1 from cart when minus button is clicked
            addToCart(productData, -1);
            updateCartCounter(cartData.totalQuantity);
        } else {
            addToCart(productData, -1);
        

            plusButton.remove();
            minusButton.remove();
            quantityDisplay.remove();
            buyNowButton.style.display = 'inline-block';
            updateCartCounter(cartData?.totalQuantity);
        }
        updateCartDisplay(cartData)
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





























