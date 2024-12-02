let productItems = [];

let filteredBrands = [];

let selectedBrand = "";

let addedToCart = [];

loadProducts();

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.addEventListener("scroll", function(){
    var nav = document.querySelector("nav");
    nav.classList.toggle("sticky", window.scrollY > 0);
});

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links =>{
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id +']').classList.add('active');
            });
        }
    });
}

const observer = new IntersectionObserver ((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting){
            entry.target.classList.add('show');
        }else{
            entry.target.classList.remove('show')
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close-btn');

openModalBtn.addEventListener('click', () => {
  modal.style.display = 'block';
  if (addedToCart.length > 0){
    document.getElementById('checkout').style.display = "block";
  }else {
    document.getElementById('checkout').style.display = "none";
  }
  displayCart();
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

function addProduct() {
    let filteredBrands = JSON.parse(localStorage.getItem('products'));
    filteredBrands.push({
        brandName: document.getElementById("brandName-sm").value,
        description: document.getElementById("description-sm").value,
        price: document.getElementById("price-sm").value,
        priceLabel: document.getElementById("priceLabel-sm").value,
        imgSrc: document.getElementById("image-sm").value
    });
    localStorage.setItem("products",JSON.stringify(filteredBrands));
    window.location.href = "http://127.0.0.1:5500/Shoes/index.html#products"
}

function loadCart() {
    addedToCart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById('countLabel').innerHTML = addedToCart.length;
}

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(addedToCart));
    document.getElementById('countLabel').innerHTML = addedToCart.length;
}

function clearCart() {
    localStorage.removeItem('cart');
    localStorage.clear();
    addedToCart = [];
    document.getElementById('countLabel').innerHTML = 0;
}

function loadProducts() {
    loadCart();

    if(localStorage.getItem('products')) {
        let jsonData = JSON.parse(localStorage.getItem('products'));
        productItems = jsonData;
        filteredBrands = jsonData;
        filterBrand();
    } else {
        fetch('http://127.0.0.1:5500/Shoes/products.txt')
            .then((response) => {
                if (!response.ok) {
                throw new Error('Failed to fetch the file');
                }
                return response.text();
            })
            .then((data) => {
                const jsonData = JSON.parse(data); // Parse as JSON
                productItems = jsonData;
                filteredBrands = jsonData;
                localStorage.setItem('products', data);
                filterBrand();
            })
            .catch((error) => {
                console.error('Error accessing file:', error);
            });
    }
}

function displayProducts(products){
    var product = document.getElementById("product");
    product.innerHTML = "";
    for(let x=0; x<products.length; x++) {
        product.innerHTML += '<div class="items">' +
            '<div class="product-img">' +
            '<img src='+products[x].imgSrc+'>' +
            '</div>' +
            '<h6 class="brandname">'+products[x].brandName+'</h6>' +
            '<span class="description">'+products[x].description+'</span>' +
            '<span class="price">'+products[x].priceLabel+'</span>' +
            '<button onclick="addToCart(\''+ products[x].brandName +'\', \''+ products[x].imgSrc +'\', \''+ products[x].description +'\', \''+ products[x].price +'\', \''+ products[x].priceLabel +'\')" class="cart-btn">Add to Cart</button>' +
        '</div>';
    }
}


function filterBrand(){
    let search = document.getElementById('find').value;
    selectedBrand = document.getElementById('filter').value;
    if(selectedBrand == "all"){
        selectedBrand = "";
    }
    filteredBrands = productItems.filter(function(product){
        return (selectedBrand == "" || product.brandName == selectedBrand) && (product.brandName.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase()));
    });

    displayProducts(filteredBrands);
}

function addToCart(brandName, imgSrc, description, price, priceLabel) {
    let product = {
        quantity:1,
        brandName: brandName,
        imgSrc: imgSrc,
        description: description,
        price:  price,
        priceLabel: priceLabel
    }
    addedToCart.push(product);
    updateCart();
}

function displayCart(){
    let items = document.getElementById('items-container');
    items.innerHTML = "";
    for (let x = 0; x < addedToCart.length; x++){
        items.innerHTML += '<tr>' +
            '<td class="items-cart t-data">'+
                '<img class="item-img" src="'+ addedToCart[x].imgSrc+'" width="45px">' +
                '<div class="brand-desc">' +
                    '<span class="brandName">'+addedToCart[x].brandName+'</span> <br>' + 
                    '<span class="description-cart">'+ addedToCart[x].description+'</span></td>' +
                '</div>' +
            '<td class="t-data"><h3 class="pricing">'+ addedToCart[x].priceLabel+'</h3></td>' +
            '<td class="t-data"><h3 class="quantity"><i onclick="decreaseQuantity('+addedToCart[x].quantity+', '+x+')" class="lessthan fa-solid fa-less-than"></i><span id="increaseNum'+x+'">'+addedToCart[x].quantity+'</span><i onclick="increaseQuantity('+addedToCart[x].quantity+', '+x+')" class=" greaterthan fa-solid fa-greater-than"></i></h3></td>' +
            '<td class="t-data"><h3 class="total">'+ addedToCart[x].price*addedToCart[x].quantity+'</h3></td>' +
        '</tr>';
    }
}

function decreaseQuantity(quantity, index){
    
    if(quantity-1 == 0){
        addedToCart.splice(index, 1);
        if(addedToCart.length == 0) {
            document.getElementById('checkout').style.display = "none";
        }
        updateCart();
    } else {
        addedToCart[index].quantity = quantity-1;
    }
    displayCart();
}

function increaseQuantity(quantity, index){
    console.log(quantity, index);
    addedToCart[index].quantity = quantity+1;
    displayCart();
}

function checkoutButton(){
    let checkout = document.getElementById('checkout')
    if (checkout){
        window.location.href="http://127.0.0.1:5500/Shoes/feedback.html";
        alert("Thank you for checking out!");
        clearCart();
        closeBtn.click();
    }
}


