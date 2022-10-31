const cart = []
//adding price from backend//
async function getprice(id){
  let price = 0
await fetch("http://127.0.0.1:3000/api/products/"+id)
  .then((res) => res.json())
  .then((data) => {
    price = data.price
})
return price
}
//get items from localstorage
getItemsFromCache();
cart.forEach((item) => showItem(item));

// button and event listener//
const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => submitForm(e));

//get items from cache function
function getItemsFromCache() {
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i)) || " ";
    const itemObject = JSON.parse(item);
   cart.push(itemObject);
  }
}

// funct to gather all functions to place item on page using Async and await
async function showItem(item) {
  const article = createArticle(item);
  const div = createImageDiv(item);
  article.appendChild(div);
  item.price = await getprice(item.id)
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
    (total, item) => total + item.price * item.quantity, 0);
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
    updatePriceAndQuantity(item.id, input.value, newValue, item));
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
  saveNewDataToCache(item);
}
// add new data to local storage == key split using id and color 
function saveNewDataToCache(item) {
  const dataToSave = JSON.stringify(item);
  const key =`${item.id}-${item.color}`;
  localStorage.setItem(key, dataToSave);
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
  // if (isFormInvalid()) return;
  // if (isEmailInvalid()) return;
  // if (isVilleInvalid()) return;
  // if (isLastNameInvalid()) return;
  // if (isFirstNameInvalid()) return;

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
    })
    .catch((err) => console.error(err));
}

let emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
let nameRegExp = /^[a-zA-Zéêëèîïâäçù ,'-]{3,20}$/;
let addressRegExp = /^[0-9]{1,3}[a-zA-Zéêëèîïâäçù ,'-]+$/;

//Verify first name 
firstName.addEventListener("input", function () {
    verificationFirstName(firstName);
});

function verificationFirstName() {
    let testFirstName = nameRegExp.test(firstName.value);
    if (testFirstName == false) {
        firstName.nextElementSibling.innerHTML = `First name cannot contain any numeros are special charactors`;
        return false;
    } else {
        firstName.nextElementSibling.innerHTML = "";
        return true;
    }
}

//Verif Nom de famille
lastName.addEventListener("input", function () {
    verificationLastName(lastName);
});

function verificationLastName() {
    let testlastName = nameRegExp.test(lastName.value);
    if (testlastName == false) {
        lastName.nextElementSibling.innerHTML = `Cannot contain any numbers or special charactors`;
        return false;
    } else {
        lastName.nextElementSibling.innerHTML = "";
        return true;
    }
}

//Verify city
city.addEventListener("input", function () {
    verificationCity(city);
});

function verificationCity() {
    let testCity = nameRegExp.test(city.value);
    if (testCity == false) {
        city.nextElementSibling.innerHTML = `please put in a valid city, must not content numbers`;
        return false;
    } else {
        city.nextElementSibling.innerHTML = "";
        return true;
    }
}

//Verif adresse
address.addEventListener("change", function () {
    verificationAddress(address);
});

function verificationAddress() {
    let testAddress = addressRegExp.test(address.value);
    if (testAddress == false) {
        address.nextElementSibling.innerHTML = `Please input address i.e 10 rue de Paris`;
        return false;
    } else {
        address.nextElementSibling.innerHTML = "";
        return true;
    }
}

//Verif Email
email.addEventListener("change", function () {
    verificationEmail(email);
});

function verificationEmail() {
    let testEmail = emailRegExp.test(email.value);
    if (testEmail == false && email.value != "") {
        email.nextElementSibling.innerHTML = "Please input a valid email address";
        return false;
    } else {
        email.nextElementSibling.innerHTML = "";
        return true;
    }
}
// function verificationFirstName() {
//   let testFirstName = nameRegExp.test(firstName.value);
//   if (testFirstName == false) {
//       firstName.nextElementSibling.innerHTML = `Ne peut contenir de chiffres ou caractères spéciaux`;
//       return false;
//   } else {
//       firstName.nextElementSibling.innerHTML = "";
//       return true;
//   }
// }
// function isFirstNameInvalid() {
//   const nom = document.querySelector("#firstName").value 
//   const regex =/^[A-Za-z]+$/; 
//   if (regex.test(nom) === false) {
//     prompt("please add valid first name");
//     return true;
//   }
//   return false;
// }
// validation for form entry ensure all values have data//
// function isFormInvalid() {
//   const form = document.querySelector(".cart__order__form");
//   const inputs = form.querySelectorAll("input");
//   inputs.forEach((input) => {
//     if (input.value === "") {
//       alert("please fill all the fields");
//       return true;
//     }
//     return false;
//   });
// }
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
  return body;
}
//get data from localstorage if change and split id where color was attacted//
function getIdsFromCache() {
  const numberOfProducts = localStorage.length;
  const ids = []
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i)
    const id = key.split(" -")[0]
    ids.push()
  }
  return ids;
}