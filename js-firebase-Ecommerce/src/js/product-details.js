import '../css/product-details.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../js/navbar.js'



import {
    DB, collection, getDocs, getDoc, doc, query, where,auth,onAuthStateChanged,addDoc

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

        const addToCartBtn = document.querySelector('.add-to-cart-btn');
addToCartBtn.addEventListener('click', () => {
  addToCart(productData.id,productData);
});

        // Helper function to filter products (not needed here, but included for completeness)


        // Initially set the "All" filter button as active
    } catch (error) {
        console.error("Error displaying product details:", error);
    }
}



// async function addToCart(productId,productData) {
//     try {
   
//     onAuthStateChanged(auth, (user) => {

//         console.log(user);

//         if(user){


//              getUserCart(user.uid)
//             .then(userCartItems => {
//                 console.log("User Cart Items:", userCartItems);
//             })
//             .catch(error => {
//                 console.error("Error fetching user cart items:", error);
//             });
//             const cartItem = {
//                 imageName: productData.image, // Assuming 'image' field stores the image name
//                 imageURL: productData.imageURL, // Assuming 'imageURL' field stores the image URL
//                 name: productData.name,
//                 price: productData.price,
//                 productId,
//               };
          
             

//         }

//     })
  
     
//     } catch (error) {
//       console.error("Error adding product to cart:", error);
//     }
// }


async function addToCart(productId, productData) {
    try {
      // Check user authentication status
     onAuthStateChanged(auth,async (user)=>{

         if (user) {
           // Authenticated user - Fetch user's cart and check for existing product
           const userCartItems = await getUserCart(user.uid);
           const existingItem = userCartItems.find(item => item.productId === productId);
     
           if (existingItem) {
             // Product already exists in cart - Handle quantity update (optional)
             console.log("Product already exists in cart:", existingItem);
             // You can optionally update the quantity here (e.g., existingItem.quantity++)
           } else {
             // Product not found in cart - Add it
             const cartItem = {
               imageName: productData.image,
            //    imageURL: productData.imageURL,
               name: productData.name,
               price: productData.price,
               productId,
               quantity: 1, // Default quantity to 1
             };
             await addToUserCart(user.uid, cartItem); // Add to user's cart
             console.log("Product added to cart successfully.");
           }
         } else {
           // Unauthenticated user - Redirect to login page
           console.log("User is not authenticated. Redirecting to login...");
           redirectToLogin(); // Implement your login page redirection logic
         }
     });
  
    } catch (error) {
      console.error("Error adding product to cart:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  }



async function getUserCart(uid) {
    // Get a reference to the user's document
    const userDocRef = doc(DB, "Users", uid);

    // Get a reference to the 'user-cart' subcollection
    const userCartCollectionRef = collection(userDocRef, "user-cart");

    // Fetch all documents in the 'user-cart' subcollection
    const userCartSnapshot = await getDocs(userCartCollectionRef);


    // Extract and return data from the snapshot
    const userCartItems = userCartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return userCartItems;
}







async function addToUserCart(userId, cartItem) {
    try {
      // Reference the user's cart subcollection
      const userCartRef = collection(DB, "Users", userId, "user-cart");

      // Add the cart item to the user's cart subcollection
      await addDoc(userCartRef, cartItem);
      console.log("Product added to user's cart:", cartItem);
    } catch (error) {
      console.error("Error adding product to user's cart:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  }
  

displayProductDetails(productId);


