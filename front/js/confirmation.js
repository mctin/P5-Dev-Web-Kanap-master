const orderId = getOrderId();
showOrderId(orderId);
deleteCache();
localStorage;
//search in url for orderid//
function getOrderId() {
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
  return urlParams.get("orderId");
}
//find class and add value
function showOrderId(orderid) {
  const orderIdElement = document.getElementById("orderId")
  orderIdElement.textContent = orderId
}
// delete from cache using clear 
function deleteCache() {
  const cache = window.localStorage;
  cache.clear();
}
