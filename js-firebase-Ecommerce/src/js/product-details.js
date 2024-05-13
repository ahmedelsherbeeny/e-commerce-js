import '../css/product-details.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../js/navbar.js'



import {
    DB, collection, getDocs, getDoc, doc, query, where

} from "./firebase.js";

import eLogo from '../images/e-logo.jpg';





const productId = new URLSearchParams(window.location.search).get('productId');

async function getProductById(productId) {
    try {
        const productQuery = query(collection(DB, "products"), where("id", "==", productId));
        const querySnapshot = await getDocs(productQuery);

        if (querySnapshot.empty) {
            console.warn(`Product with ID ${productId} not found in Firebase.`);
            return null; // Or handle the case where product is not found
        }

        // Assuming only one document matches the ID (handle multiple matches if needed)
        const productData = querySnapshot.docs[0].data();
        console.log(productData);
        return productData;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return null; // Or handle the error appropriately
    }
}




async function displayProductDetails(productId) {
    console.log("working");
    try {
        // Replace with your Firebase product data retrieval function
        const productData = await getProductById(productId); // Fetch product data
        console.log(productData);

        if (!productData) {
            console.error(`Product with ID ${productId} not found.`);
            return;
        }

        const productImages = document.querySelector('.product-images');
        const mainImage = document.getElementById('main-image');
        const productInfo = document.querySelector('.product-info');

        // Display main image
        mainImage.src = `data:image/png;base64,${productData.image}`;

        // Display product details (name, price, description, etc.)
        productInfo.innerHTML = `
      <h2 class="name">${productData.name}</h2>
      <p> <span class="price">Price: </span> ${productData.price}$</p>
      <p><span class="desc">Description:</span> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate tempora corporis dolores rem tempore voluptates
      culpa obcaecati magnam ipsam eius officia natus, aliquam, aliquid magni doloremque facere neque distinctio fugit.</p>
      `;

        // Display image thumbnails
        productData.colors.forEach(color => {
            const thumbnail = document.createElement('img');
            thumbnail.src = `data:image/png;base64,${color.imageURL}`;
            thumbnail.alt = `${productData.name} - ${color.colorName}`;
            thumbnail.classList.add('thumbnail');

            thumbnail.addEventListener('click', () => {
                mainImage.src = color.imageURL;
            });

            productImages.appendChild(thumbnail);
        });

    } catch (error) {
        console.error("Error displaying product details:", error);
    }
}

displayProductDetails(productId);


