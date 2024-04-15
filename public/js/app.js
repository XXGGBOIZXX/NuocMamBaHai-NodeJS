import User from "../model/user.js";
import Product from "../model/product.js";
import Order from "../model/order.js";
class App{
  constructor(){
    this.updateButtons();
    this.displayProducts();
    this.productDetails();
    this.SignIn();
    this.SignUp();
    this.SignOut();
    
    this.displayCart();
    this.add2Cart();
    this.placeOrder();
    this.delete();
    this.productAdmin();

    this.displayOrders();
  }

  async updateButtons() {
    let user= JSON.parse(sessionStorage.getItem('user'));
    let usernameElement = document.getElementById("username");
    let signupButton = document.getElementById("signup");
    let signinButton = document.getElementById("signin");
    let signoutButton = document.getElementById("signout");

    let addcartButton = document.getElementById("addcart");
    let cartButton = document.getElementById("cart");

    let ordersButton = document.getElementById("orders");
    let addButton = document.getElementById("add");
    let editButton = document.getElementById("edit");
    let deleteButton = document.getElementById("delete");

    let nameField = document.querySelector(".name-field");
    let priceField = document.querySelector(".price-field");

    if (user){
      usernameElement.textContent = user.username;
      signupButton.style.display = "none";
      signinButton.style.display = "none";
      signoutButton.style.display = "block";

      if (user.username == "admin")
      {
        
        ordersButton.style.display = "block";
        

        addButton.classList.remove("hidden");
        editButton.classList.remove("hidden");
        deleteButton.classList.remove("hidden");

        nameField.readOnly = false;
        priceField.readOnly = false;
        
      }
      else
      {
        cartButton.style.display="block"; 
        addcartButton.classList.remove("hidden");
      }
    }
 
  }

  SignOut()
  {
    let signout= document.getElementById("signout");
    signout.addEventListener("click",()=>{
    sessionStorage.clear();
    window.location.href = '/index.html';
    });
    
  }

  async SignIn() {
    try {
      let form = document.querySelector('#signinform');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        this.user = await User.signIn(
          form.username.value,
          form.password.value);
        sessionStorage.setItem('user', JSON.stringify(this.user));
        window.location.href = '/';
      });
    } catch (error) {
      throw new Error(error);

    }
  }
  
  async SignUp() {
    try {
    let form = document.querySelector('#signupform');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.user = await User.signUp(
        form.username.value,
        form.password.value,
        form.fullname.value,
        form.address.value,
        form.phone.value
      );
      sessionStorage.setItem('user', JSON.stringify(this.user));
      window.location.href = '/';
    });
    } catch (error) {
      throw new Error(error);
    }
  }

  async add2Cart(){
    let cart=JSON.parse(sessionStorage.getItem('cart'));
    if (!cart)
      cart=[];
    let btn = document.querySelector('#addcart');
    btn.addEventListener('click', async () => {
      let product= JSON.parse(sessionStorage.getItem('product'));
      cart.push(product);
      await sessionStorage.setItem('cart', JSON.stringify(cart));
      alert("Added to card");
      window.location.href = '/products.html';
      
    });
  }
  

  async delete(){
    let product= new Product (await JSON.parse(sessionStorage.getItem('product')));
    let but = document.querySelector('#delete');
    but.addEventListener('click', async () => {
      product.deleteProduct();
      sessionStorage.removeItem("product");
      alert("Removed");
      window.location.href = '/products.html';
    });
  }

  async add(){
   
  }

  async productAdmin() {
      let productData = await JSON.parse(sessionStorage.getItem('product'));
      let product = new Product(productData);
      let nameField = document.querySelector(".product .name-field");
      let priceField = document.querySelector(".product .price-field");
      let productImage = document.querySelector(".product .img"); 
      let editButton = document.getElementById("edit");
      let addButton = document.getElementById("add");
      let file= document.getElementById("image");
      let img= productImage.src;
      file.onchange= function(){
          productImage.src=URL.createObjectURL(file.files[0]);
          img="img/"+file.files[0].name;
      }
      
      editButton.addEventListener('click', async () => {
        let name = nameField.value;
        let price = parseInt(priceField.value);
        let data ={name, price,img}
        let res = await product.editProduct(data);
        console.log( res.json());
        alert("Changes saved!");
        window.location.href = '/products.html'; 
      });

      addButton.addEventListener('click', async () => {
        let name = nameField.value;
        let price = parseInt(priceField.value);
        let data ={name, price,img}
        let res = await product.addProduct(data);
        console.log( res.json());
        alert("Product added!");
        window.location.href = '/products.html'; 
      });

  }

  async placeOrder(){
   
    let user=JSON.parse(sessionStorage.getItem('user'));
    let cart=JSON.parse(sessionStorage.getItem('cart'));
    let but = document.getElementById('checkout');
    but.addEventListener('click', async () => {

      let data= {user:user,products:cart}
      if(!cart){
        alert("No items");
        throw new Error(error);
      }
      let order = new Order(data);
      order.makeOrder();
      alert(`Order placed, total: ${order.total}`);
      sessionStorage.removeItem("cart");
      window.location.href = '/index.html';

    });
  }

  async productDetails(){
    document.addEventListener('DOMContentLoaded', () => {
      const selectedProduct = JSON.parse(sessionStorage.getItem('product'));
      const imgElement = document.querySelector('.img');
      const nameField = document.querySelector('.name-field');
      const priceField = document.querySelector('.price-field');

      imgElement.src = selectedProduct.img;
      nameField.value = selectedProduct.name;
      priceField.value = selectedProduct.price; 
  });
  }

  async displayCart(){
    let cartItemsContainer = document.getElementById("cart-items");
    let userNameElement = document.getElementById("user-name");
    let userAddressElement = document.getElementById("user-address");
    let userPhoneElement = document.getElementById("user-phone");
    let cartTotalElement = document.getElementById("cart-total");
    let total = 0;
    let user= new User(JSON.parse(sessionStorage.getItem('user')));
      userNameElement.textContent = user.fullname;
      userAddressElement.textContent = user.address;
      userPhoneElement.textContent = user.phone;
    let cart=JSON.parse(sessionStorage.getItem('cart'));
    cart.forEach(item => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item"); // Add a class for styling
    
      // Add image, price, and name elements within the cart item
      const imageElement = document.createElement("img");
      imageElement.src = item.img;
      cartItemElement.appendChild(imageElement);
    
      const priceElement = document.createElement("p");
      priceElement.textContent = `Price: ${item.price} `;
      total+=item.price;
      cartItemElement.appendChild(priceElement);
    
      const nameElement = document.createElement("p");
      nameElement.textContent = `Name: ${item.name}`;
      cartItemElement.appendChild(nameElement);
      cartItemsContainer.appendChild(cartItemElement);
    });
    cartTotalElement.textContent=total;
  
  }

  async displayProducts() {
    let products = await Product.getProductList();
    const productList = document.querySelector("#productList"); // Assuming an element for the list
  
    // Create the table element
    const productTable = document.createElement('table');
    productTable.classList.add('product-table'); // Add a class for styling
  
    // Create table header row
    const tableHead = document.createElement('tr');
    tableHead.classList.add('product-table-header'); // Add a class for styling
    const headImage = document.createElement('th');
    headImage.textContent = 'Image';
    const headName = document.createElement('th');
    headName.textContent = 'Name';
    const headPrice = document.createElement('th');
    headPrice.textContent = 'Price';
    tableHead.appendChild(headImage);
    tableHead.appendChild(headName);
    tableHead.appendChild(headPrice);
    productTable.appendChild(tableHead);
  
    products.forEach(async(product) => {
      const productRow = document.createElement('tr');
      productRow.classList.add('product-row'); // Add a class for styling
  
      const productImage = document.createElement('td');
      const imageElement = document.createElement('img');
      imageElement.src = product.img;
      imageElement.style.width = '100px'; // Adjust image width as needed
      imageElement.style.height = '100px'; // Adjust image height as needed
      productImage.appendChild(imageElement);
      productImage.style.textAlign = 'center'; // Center image within cell


      const productName = document.createElement('td');
      productName.textContent = product.name;
      productName.style.textAlign = 'center'; // Center text within cell
  
      const productPrice = document.createElement('td');
      productPrice.textContent = product.price;
      productPrice.style.textAlign = 'center'; // Center text within cell
  
      // Handle click event for product details page (replace with actual URL)
      productRow.addEventListener('click', async () => {
        await sessionStorage.setItem('product', JSON.stringify(product));

        window.location.href = `/productDetails.html`;
      });
  
      productRow.appendChild(productImage);
      productRow.appendChild(productName);
      productRow.appendChild(productPrice);
      productTable.appendChild(productRow);
    });
  
    productList.appendChild(productTable);
  }
  

  async displayOrders() {
    try {
      const orders = await Order.getOrders(); // Assuming this fetches orders
  
      const container = document.getElementById("order-container"); // Replace with your container ID
      container.innerHTML = ""; // Clear previous content
  
      orders.forEach(order => {
        const table = document.createElement("table");
        table.classList.add("order-table"); // Add a class for styling (optional)
  
        // Table header row
        const headerRow = document.createElement("tr");
        const userCell = document.createElement("th");
        userCell.colSpan = 2; // Span across two columns for user information
        userCell.textContent = `Order by: ${order.user.fullname} (${order.user.username}) | Address: ${order.user.address} | Phone: ${order.user.phone}| `;
        headerRow.appendChild(userCell);
        const totalCell = document.createElement("th");
        totalCell.textContent = `Total: $${order.total}`;
        headerRow.appendChild(totalCell);
        table.appendChild(headerRow);
  
        // Product information rows
        const productRows = order.products.map(product => {
          const row = document.createElement("tr");
          const imageCell = document.createElement("td");
          const image = document.createElement("img");
  
          // Set image source and scale dynamically
          image.src = product.img;
          image.alt = product.name;
          image.style.maxWidth = "100px"; // Adjust as needed for desired scaling
          imageCell.appendChild(image);
          row.appendChild(imageCell);
  
          const detailsCell = document.createElement("td");
          detailsCell.innerHTML = `
            <b>${product.name}</b> (ID: ${product.id})<br>
            Price: $${product.price}
          `;
          row.appendChild(detailsCell);
          return row;
        });
  
        // Add product rows to the table
        productRows.forEach(row => table.appendChild(row));
  
        container.appendChild(table);
  
        // Add a break after each order table
        const orderBreak = document.createElement("br");
        container.appendChild(orderBreak);
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }
  
}
new App();
