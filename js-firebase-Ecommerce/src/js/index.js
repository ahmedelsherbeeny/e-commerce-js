

import '../css/index.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../js/navbar.js'


import {
    DB, collection, getDocs

} from "./firebase.js";

// import eLogo from '../images/e-logo.jpg';

const productDocRef = collection(DB, "products");


// function getProductData() {
//     return new Promise((resolve, reject) => {
//         getDocs(productDocRef)
//             .then(querySnapshot => {
//                 const productDataArray = [];
//                 querySnapshot.forEach(doc => {
//                     const productData = doc.data();
//                     productDataArray.push(productData);
//                 });

//                 // Resolve the promise with the retrieved data
//                 resolve(productDataArray);
//             })
//             .catch(error => {
//                 reject(error); // Reject the promise if there's an error
//             });
//     });
// }



// getProductData()
//     .then(productDataArray => {
//         console.log(productDataArray);

//         // Loop through each product in productDataArray
//         productDataArray.forEach(productData => {
//             console.log(productData);
//             const card = document.querySelector('.products .card').cloneNode(true); // Select and clone the card template

//             const cardName = card.querySelector('.card-name');
//             const cardDescription = card.querySelector('.card-description');
//             const cardPrice = card.querySelector('.card-price');
//             const cardAvailableNumber = card.querySelector('.card-available-number');
//             const cardBrand = card.querySelector('.card-brand');
//             const cardImg = card.querySelector('.card-img img');

//             // Update content of selected elements with productData properties
//             cardImg.src = `data:image/png;base64,${productData.image}`;
//             cardName.textContent = productData.name;
//             cardDescription.textContent = productData.description;
//             cardPrice.textContent = `Price: $${productData.price}`;
//             cardAvailableNumber.textContent = `Available: ${productData.available}`;
//             cardBrand.textContent = `Brand: ${productData.brand}`;

//             // Append the updated card to the products container
//             document.querySelector('.products').appendChild(card);
//         });
//     })
//     .catch(error => {
//         console.error('Error retrieving product documents:', error);
//     });



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
        console.log(productDataArray);
        // Loop through each product in productDataArray
        let div = document.getElementById('prods') // 
        productDataArray.forEach(productData => {
            let card = ''
            console.log(productData);
            card += `
            <div class="card-img">
            <img src="data:image/png;base64,${productData.image}">
            </div>
            <div class="card-name">
                ${productData.name}
            </div>
            <div class="card-description">${productData.description}</div>
            <div class="card-price">${productData.price}</div>
            <div class="card-available-number">${productData.available}</div>
            <div class="card-brand">${productData.brand}</div>
            `
            div.innerHTML += card;
        });

    } catch (error) {
        console.error(error.message);
    }
}

// Call the function to display product cards
displayProductCards();





























