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
        <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate tempora corporis dolores rem tempore voluptates
          culpa obcaecati magnam ipsam eius officia natus, aliquam, aliquid magni doloremque facere neque distinctio fugit.
        </p>
        <hr>
        <div class="filter-container">
          <span>Filter by Color:</span>
         
          </div>
          <p class="price"> ${productData.price}$</p>

          <button class="add-to-cart-btn">Add to Cart</button>

        </div>


        
        `;

        // Create and display thumbnails for each color
        productData.colors.forEach(color => {

            const filterBtn = document.createElement('button');
            filterBtn.classList.add('filter-btn');
            filterBtn.dataset.color = color.colorName; // Use data attribute to store color name
            filterBtn.style.backgroundColor = color.colorName; // Set button color based on color name
            filterBtn.style.width = '33px';
            filterBtn.style.height = '33px';



            filterBtn.addEventListener('mouseenter', () => {
                mainImage.src = `data:image/png;base64,${color.imageURL}`;
            });

            // Reset main image on mouse leave
            filterBtn.addEventListener('mouseleave', () => {
                mainImage.src = `data:image/png;base64,${productData.image}`;
            });

            productInfo.querySelector('.filter-container').appendChild(filterBtn);



            const thumbnail = document.createElement('img');
            thumbnail.classList.add('thumbnail');
            thumbnail.src = `data:image/png;base64,${color.imageURL}`;
            thumbnail.alt = `${productData.name} - ${color.colorName}`;
            thumbnail.dataset.color = color.colorName; // Add data attribute to store color name


            productImages.appendChild(thumbnail);
        });

        // Helper function to filter products (not needed here, but included for completeness)


        // Initially set the "All" filter button as active
    } catch (error) {
        console.error("Error displaying product details:", error);
    }
}

displayProductDetails(productId);


