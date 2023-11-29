const products = JSON.parse(localStorage.getItem("product")) || [];

const productList = document.getElementById("product-list");
const categoryButtons = document.querySelectorAll("#category-filters button");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

function filterProducts(category, keyword) {
  let filteredProducts = products;
  if (category !== "all") {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }
  if (keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.productName.toLowerCase().includes(lowercaseKeyword) ||
      product.productDetails.toLowerCase().includes(lowercaseKeyword)
    );
  }
  return filteredProducts;
}

function displayProducts(category, keyword) {
  const filteredProducts = filterProducts(category, keyword);

  productList.innerHTML = "";

  filteredProducts.forEach((product) => {
   const productElem = document.createElement("div");
  productElem.classList.add("product");

  const imgElem = document.createElement("img");
  imgElem.src = product.image;
  imgElem.alt = product.productName;
  productElem.appendChild(imgElem);

  const nameElem = document.createElement("div");
  nameElem.classList.add("product-name");
  nameElem.textContent = product.productName;
  productElem.appendChild(nameElem);

  const detailsElem = document.createElement("div");
  detailsElem.classList.add("product-details");
  detailsElem.textContent = product.productDetails;
  productElem.appendChild(detailsElem);

  const priceElem = document.createElement("div");
  priceElem.classList.add("product-cat");
  priceElem.textContent = `$${product.productPrice}`;
  productElem.appendChild(priceElem);

  const catElem = document.createElement("div");
  catElem.classList.add("product-price");
  catElem.textContent = product.category;
  productElem.appendChild(catElem);

  const dateElem = document.createElement("div");
  dateElem.classList.add("product-date");
  dateElem.textContent = "Added Date: "+ product.date;
  productElem.appendChild(dateElem);

  const pAvailElem = document.createElement("div");
  pAvailElem.classList.add("product-date");
  pAvailElem.textContent = product.productAvailability;
  productElem.appendChild(pAvailElem);

  const buttonElem = document.createElement("button");
  buttonElem.textContent = "Add to Cart";
  buttonElem.addEventListener("click", () => {
    addToCart(product);
  });
  productElem.appendChild(buttonElem);

  productList.appendChild(productElem);
});

}

displayProducts("all");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    displayProducts(category, searchInput.value);
  });
});

searchButton.addEventListener("click", () => {
  displayProducts("all", searchInput.value);
});

searchInput.addEventListener("input", () => {
  displayProducts("all", searchInput.value);
});


function updateCart() {
const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const cartItemsElem = document.getElementById("cart-items");
const cartTotalElem = document.getElementById("cart-total");

cartItemsElem.innerHTML = "";
let cartTotal = 0;
cartItems.forEach(item => {
  const itemElem = document.createElement("li");
  const imgElem = document.createElement("img");
  imgElem.src = item.product.image;
  imgElem.alt = item.product.productName;
  itemElem.appendChild(imgElem);
  itemElem.innerHTML += `${item.quantity} x ${item.product.productName}`;

  const removeButton = document.createElement("button");
  removeButton.innerHTML = "Remove";
  removeButton.addEventListener("click", () => {
    
    const index = cartItems.indexOf(item);
    if (index > -1) {
      cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      itemElem.remove();
      cartTotal -= item.product.productPrice * item.quantity;
      cartTotalElem.textContent = `Total: $${cartTotal.toFixed(2)}`;
      if (cartItems.length === 0) {
        cartElem.classList.add("hidden");
      }
    }
  });

  itemElem.appendChild(removeButton);
  cartItemsElem.appendChild(itemElem);

  cartTotal += item.product.productPrice * item.quantity;
});

cartTotalElem.textContent = `Total: $${cartTotal.toFixed(2)}`;

const cartElem = document.getElementById("cart");
if (cartItems.length === 0) {
  cartElem.classList.add("hidden");
} else {
  cartElem.classList.remove("hidden");
}
}
function addToCart(product) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let cartItem = cartItems.find(item => item.product.productName === product.productName);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cartItem = { product: product, quantity: 1 };
    cartItems.push(cartItem);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCart();
}

function checkout() {
  alert("Order Placed Successfully!");
  sessionStorage.removeItem("cartItems");
  updateCart();
}


let slideIndex = 0;
const slides = document.querySelector('.slides');
const images = slides.querySelectorAll('img');
const leftArrow = document.querySelector('.left');
const rightArrow = document.querySelector('.right');


function changeSlide(n) {
  slideIndex += n;
  if (slideIndex < 0) {
    slideIndex = images.length - 1;
  } else if (slideIndex >= images.length) {
    slideIndex = 0;
  }
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
}


leftArrow.addEventListener('click', () => changeSlide(-1));
rightArrow.addEventListener('click', () => changeSlide(1));

setInterval(() => {
  changeSlide(1);
}, 2000);
