

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
                <h3 class="">
                ${productData.name}

                </h3>
                <h2 class="price">${productData.price}.<small>98</small> €</h2>
                <h2 class="price"> Available: ${productData.available}</h2>

                <a href="#" class="buy">Buy Now</a>
                </div>

    

            `;
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
});






export { getProductData }





























