//first fetch for index page //
fetch("http://127.0.0.1:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    return addProducts(data);
  });
 //adding products to page from fetch output//
function addProducts(sofas) {
  sofas.forEach((sofa) => {
    const { _id, imageUrl, altTxt, name, description } = sofa
    const aref = makeAref(_id);
    const article =  makeArticle(aref)
    const img = makeImg(imageUrl, altTxt);
    const h3 = makeH3(name);
    const p = makeParagraph(description);

    appendElementsToArticle(article, [img, h3, p]);
    appendArticleToAref(aref, article);
  });
}
//embedding items into article //
function appendElementsToArticle(article, array) {
  array.forEach((item) => {
    article.appendChild(item);
  });
}
/// adding html link to a element
function makeAref(id) {
  const aref = document.createElement("a");
  aref.href = "./product.html?id=" + id;
  return aref;
}
//adding (a) to items section and also adding article to (a) //
function appendArticleToAref(aref, article) {
  const items = document.querySelector("#items");
  if (items != null) {
    items.appendChild(aref);
    aref.appendChild(article);
  }
}
// to create img consisting  of both imageUrl and alttxt///
function makeImg(imageUrl, altTxt) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = altTxt;
  return img;
}
//making H3 and also adding classname//
function makeH3(name) {
  const h3 = document.createElement("h3");
  h3.textContent = name;
  h3.classList.add("productName");
  return h3;
}
//making P and also adding classname//
function makeParagraph(description) {
  const p = document.createElement("p");
  p.textContent = description;
  p.classList.add("productDescription");
  return p;
}
//making article //
function makeArticle() {
  const article = document.createElement("article")
return article
}