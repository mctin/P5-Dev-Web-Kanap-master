const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
if (id != null) {
  let itemPrice = 0;
 let imgUrl, altText, articleName;
}
//get data by id //
fetch(`http://127.0.0.1:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => handleData(res));

  //to convert data const sofa array of ids and bringing in all create functions//
function handleData(sofa) {
  const { altTxt, colors, description, imageUrl, name, price } = sofa;
 // itemPrice = price;
  imgUrl = imageUrl;
  altText = altTxt;
  articleName = name;
  createImage(imageUrl, altTxt);
  createTitle(name);
  createPrice(price);
  createDescription(description);
  createColors(colors);
}
//make image and append to class//
function createImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  if (parent != null) parent.appendChild(image);
}
//make title and append to element//
function createTitle(name) {
  const h1 = document.querySelector("#title");
  if (h1 != null) h1.textContent = name;
}
//make price and append to element//
function createPrice(price) {
  const span = document.querySelector("#price");
  if (span != null) span.textContent = price;
}
//make description and append to element//
function createDescription(description) {
  const p = document.querySelector("#description");
  if (p != null) p.textContent = description;
}
//choose color option added to colors class
function createColors(colors) {
  const select = document.querySelector("#colors");
  if (select != null) {
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }
}
// add to cart click listener//
const button = document.querySelector("#addToCart");
button.addEventListener("click", clickForwarder);

// function to add items to cart(local storage)
function clickForwarder() {
  const colors = document.querySelector("#colors").value;
  const quantity = document.querySelector("#quantity").value;

  
  if (orderError(colors, quantity)) return;
  saveOrder(colors, quantity);
 addTocart();
}
//collects data and revamps id to include color on id add item to storage //
function saveOrder(color, quantity) {
  const key = `${id}-${color}`;
  const data = {
    id: id,
    color: color,
   // price: itemPrice,//
    quantity :Number(quantity),
    imageUrl: imgUrl,
    altTxt: altText,
    name: articleName,
  };
  localStorage.setItem(key,JSON.stringify(data));
}
//alert when no imput or only one input//
function orderError(color, quantity) {
  if (color == null || color === "" || quantity == null || quantity == 0) {
    alert("please select color and quantity");
    return true;
  }
}
// forward link to cart.html
function addTocart() {
  window.location.href = "cart.html";
}
