const orderId = getOrderId();
displayOrderId(orderId);
removeAllCache();
localStorage;

function getOrderId() {
  const queryString = window.location.search
 const urlParams = new URLSearchParams(queryString)
  return urlParams.get("orderId");
}
function displayOrderId(orderID) {
  const orderIdElement = document.getElementById("orderId")
  orderIdElement.textContent = orderId
  console.log(orderIdElement);
}
function removeAllCache() {
  const cache = window.localStorage;
  cache.clear();
}
