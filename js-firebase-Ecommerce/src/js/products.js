import '../css/products.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../js/navbar.js'
import { getProductData } from '../js/index'
let productDataArray = []; // You should initialize this array somewhere in your code
const itemsPerPage = 1;


function updatePageNumbers(currentPage, totalPages) {
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = ''; // Clear existing buttons

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-number');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => handlePageButtonClick(i));
        pageNumbers.appendChild(button);
    }
}
function handlePageButtonClick(pageNumber) {
    renderTableRows(pageNumber, itemsPerPage);
    updatePaginationButtons(pageNumber, Math.ceil(productDataArray.length / itemsPerPage));
}

// Function to render table rows based on the current page
function renderTableRows(pageNumber, itemsPerPage) {
    const tbody = document.querySelector('#paginatedTable tbody');
    tbody.innerHTML = ''; // Clear existing rows

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = productDataArray.slice(startIndex, endIndex);

    currentPageData.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.category}</td>
            <td>${product.brand}</td>
            <td>${product.price}</td>
            <td>${product.available}</td>
            <td>#</td>
        `;
        tbody.appendChild(row);
    });

    // Update page numbers display
    updatePageNumbers(pageNumber, Math.ceil(productDataArray.length / itemsPerPage));
}

function updatePaginationButtons(currentPage, totalPages) {
    document.getElementById('first').disabled = currentPage === 1;
    document.getElementById('prev').disabled = currentPage === 1;
    document.getElementById('next').disabled = currentPage === totalPages;
    document.getElementById('last').disabled = currentPage === totalPages;
}

// Function to handle pagination button clicks
function handlePaginationButtonClick(event) {
    const currentPage = parseInt(document.getElementById('pageNumbers').dataset.currentPage);
    const totalPages = Math.ceil(productDataArray.length / itemsPerPage);

    switch (event.target.id) {
        case 'first':
            renderTableRows(1, itemsPerPage);
            updatePaginationButtons(1, totalPages);
            break;
        case 'prev':
            renderTableRows(currentPage - 1, itemsPerPage);
            updatePaginationButtons(currentPage - 1, totalPages);
            break;
        case 'next':
            renderTableRows(currentPage + 1, itemsPerPage);
            updatePaginationButtons(currentPage + 1, totalPages);
            break;
        case 'last':
            renderTableRows(totalPages, itemsPerPage);
            updatePaginationButtons(totalPages, totalPages);
            break;
    }
}

// Add event listeners to pagination buttons
document.getElementById('first').addEventListener('click', handlePaginationButtonClick);
document.getElementById('prev').addEventListener('click', handlePaginationButtonClick);
document.getElementById('next').addEventListener('click', handlePaginationButtonClick);
document.getElementById('last').addEventListener('click', handlePaginationButtonClick);

// Assuming you have retrieved the product data and want to render it
getProductData()
    .then((data) => {
        // Store the retrieved product data in the productDataArray variable
        productDataArray = data;

        // Initial setup: render first page with 5 items per page
        renderTableRows(1, itemsPerPage);
        updatePaginationButtons(1, Math.ceil(productDataArray.length / itemsPerPage));
    })
    .catch((error) => {
        console.error('Error retrieving product data:', error);
    });