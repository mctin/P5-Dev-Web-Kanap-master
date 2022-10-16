const cart = [];
//get items from cache//
getItemsFromCache();
cart.forEach((item) => showItem(item));

// button and event listener//
const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => submitForm(e));

//get items from cache 
function getItemsFromCache() {
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i)) || "";
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

// funct to gather all functions to place item on page
function showItem(item) {
  const article = createArticle(item);
  const div = createImageDiv(item);
  article.appendChild(div);
  const cardItemContent = createCartContent(item);
  article.appendChild(cardItemContent);
  showArticle(article);
  showTotalQuantity();
  showTotalPrice();
}
//getting total quantity 
function showTotalQuantity() {
  const totalQuantity = document.querySelector("#totalQuantity");
  const total = cart.reduce((total, item) => total + item.quantity, 0);
  totalQuantity.textContent = total;
}
// show total price  total +price * quantity
function showTotalPrice() {
  const totalPrice = document.querySelector("#totalPrice");
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  totalPrice.textContent = total;
}
//to add element and create class//
function createCardItemContent() {
  const div = document.createElement("div");
  div.classList.add("card__item__content");
}
//to add element and create class and add content//
function createCartContent(item) {
  const cardItemContent = document.createElement("div");
  cardItemContent.classList.add("cart__item__content");

  const description = createDescription(item);
  const settings = createSettings(item);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);
  return cardItemContent;
}
//to add element and create class and add content//
function createSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  addQuantityToSettings(settings, item);
  changeToSettings(settings, item);
  return settings;
}
//change to settings add to element and add class and add event listener ad in function to delete item//
function changeToSettings(settings, item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => deleteItem(item));
  const p = document.createElement("p");
  p.textContent = "Supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}
// delete item function
function deleteItem(item) {
  const itemToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color
  );
  cart.splice(itemToDelete, 1);
  showTotalPrice();
  showTotalQuantity();
  deleteDataFromCache(item);
  deleteArticle(item);
}
// delete article using remove funct//
function deleteArticle(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  articleToDelete.remove();
}
// delete from local storage//
function deleteDataFromCache(item) {
  const key = `${item.id}-${item.color}`;
  localStorage.removeItem(key);
}
//adding to quantity and to element, createclass, and min max input and eventlistener function and update function)
function addQuantityToSettings(settings, item) {
  const quantity = document.createElement("div");
  quantity.classList.add("cart__item__content__settings__quantity");
  const p = document.createElement("p");
  p.textContent = "Qte:";
  quantity.appendChild(p);
  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantity;
  input.addEventListener("input", () =>
    updatePriceAndQuantity(item.id, input.value, item)
  );

  quantity.appendChild(input);
  settings.appendChild(quantity);
}
//update price and quantity//
function updatePriceAndQuantity(id, newValue, item) {
  const itemToUpdate = cart.find((item) => item.id === id);
  itemToUpdate.quantity = Number(newValue);
  item.quantity = itemToUpdate.quantity;
  showTotalPrice();
  showTotalQuantity();
  addNewDataToCache();
}
// add new data to local storage == key split using id and color 
function addNewDataToCache(item) {
  const newdata = JSON.stringify(item);
  const key = `${item.id}-${item.color}`;
  localStorage.setItem(key, newdata);
}
// adding description to panier
function createDescription(item) {
  const description = document.createElement("div");
  description.classList.add("card__item__content__description");
  const h2 = document.createElement("h2");
  h2.textContent = item.name;
  const p = document.createElement("p");
  p.textContent = item.color;
  const p2 = document.createElement("p");
  p2.textContent = item.price + "€";
  description.appendChild(h2);
  description.appendChild(p);
  description.appendChild(p2);
  return description;
}
//display article
function showArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}
//create article and add class cart__item add data set
function createArticle(item) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}
//this function creates image adds to div and makes class 
function createImageDiv(item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");
  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.altTxt;
  div.appendChild(image);
  return div;
}
// submits form also prevents normal behavior adds an alert also post body
function submitForm(e) {
  e.preventDefault();
  const form = document.querySelector(".cart__order__form");
  if (cart.length === 0) {
    alert("please select some items to buy");
    return;
  }
  if (isFormInvalid()) return;
  if (isEmailInvalid()) return;
// post request//
  const body = createRequestBody();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId;
      window.location.href = "./confirmation.html" + "?orderId=" + orderId;
      console.log(data);
    })
    .catch((err) => console.error(err));
}
// regex for valid email address//
function isEmailInvalid() {
  const email = document.querySelector("#email").value
  const regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  if (regex.test(email) === false) {
    alert("please add valid email");
    return true;
  }
  return false;
}
// validation for form entry ensure all values have data//
function isFormInvalid() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.value === "") {
      alert("please fill all the fields");
      return true;
    }
    return false;
  });
}
//body for post request 
function createRequestBody() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;
  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email
    },
  products:getIdsFromCache()
  }
  console.log("body",body);
  return body;
}
//get data from localstorage if change and split id where color was attacted//
function getIdsFromCache() {
  const numberOfProducts = localStorage.length;
  const ids = []
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i)
    console.log(key, "key");
    const id = key.split(" -")[0]
    ids.push()
  }
  return ids;
}