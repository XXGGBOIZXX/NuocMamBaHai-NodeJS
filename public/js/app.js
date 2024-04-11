//import User from "./user.js";
//import Order from "./order.js";
import Product from "./product.js";
export default class App{
  constructor(){
      this.Products();       

  }
  async Products(){
      let ps= await Product.getProductList();
      this.displayProducts(ps);
  }    
  displayProducts(products) {
    const productList = document.getElementById("productList"); // Assuming an element for the list
    productList.innerHTML = ""; // Clear existing content before adding new items

    products.forEach((product) => {
    const productItem = document.createElement("li"); // Create a list item for each product
    productItem.textContent = `${product.name} (Price: ${product.price})`; // Customize based on product properties
    productItem.dataset.productId = product.id; // Add product ID as data attribute

    productItem.addEventListener("click", (event) => {
      const selectedProductId = event.currentTarget.dataset.productId;
      console.log("Selected product ID:", selectedProductId);
      this.handleSelectedProduct(selectedProductId);
    });

    productList.appendChild(productItem);
    });
  }

  handleSelectedProduct(productId) {
    console.log("Product with ID", productId, "selected (implement your logic here)");
  }
      
}

