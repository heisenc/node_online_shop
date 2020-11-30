const cards = document.querySelectorAll(".card.product-item");
cards.forEach((card) => {
  const form = card.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const productId = form.children["productId"].value;
    const csrfToken = form.children["_csrf"].value;
    console.log(productId, csrfToken);
    fetch(`/admin/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((errData) => {
            const product = form.closest('.product-item');
            product.remove();
            console.log(errData.message);
          });
        } else {
          return response.json().then((errData) => {
            console.log(errData.message);
          });
        }
      })
      .catch(console.log);
  });
});
