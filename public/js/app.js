import User from "../model/user.js";
import Product from "../model/product.js";
import Order from "../model/order.js";
class App{
  constructor(){

    // this.user=JSON.parse(sessionStorage.getItem('user'));
    // this.cart=JSON.parse(sessionStorage.getItem('cart'));

    this.updateButtons();
    this.displayProducts();
    this.SignIn(); // Assuming these functions don't rely on 'this' context
    this.SignUp();
    this.SignOut();
    
    
  }

  async updateButtons() {
    let usernameElement = document.getElementById("username");
    let signupButton = document.getElementById("signup");
    let signinButton = document.getElementById("signin");
    let cartButton = document.getElementById("cart");
    let ordersButton = document.getElementById("orders");
    let signoutButton = document.getElementById("signout");
    let user= JSON.parse(sessionStorage.getItem('user'));
    if (user){
      usernameElement.textContent = user.username
      signupButton.style.display = "none";
      signinButton.style.display = "none";
      signoutButton.style.display = "block";
      ordersButton.style.display = "block";
      if (user.username== "admin")
      {
  
      }
      else
      {
        cartButton.style.display="block"; 
      }
    }
  
   

    ; // Update username display
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
        console.log("Sign in successful!", this.user);
        sessionStorage.setItem('user', JSON.stringify(this.user));
        window.location.href = '/';
      });
    } catch (error) {
      console.error("Sign in failed:", error);
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
      console.log("Sign up successful!", this.user);
      sessionStorage.setItem('user', JSON.stringify(this.user));
      window.location.href = '/';
    });
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  }

  async add2Cart(){
    let cart=JSON.parse(sessionStorage.getItem('cart'));
    if (!cart)
      cart=[];
    let btn = document.querySelector('#check');
    btn.addEventListener('click', async () => {
      product= JSON.parse(sessionStorage.getItem('product'));
      cart.push(product);
      await sessionStorage.setItem('cart', JSON.stringify(cart));

      console.log(this.cart,"\n",this.user);
    });
  }
  
  async add(){
    
  }

  async delete(){
    let product= await JSON.parse(sessionStorage.getItem('product'));
    await Product.de
  }

  async edit(){
    let product=JSON.parse(sessionStorage.getItem('product'));
    
  }
  async placeOrder(){
    let but = document.querySelector('#order');
    but.addEventListener('click', async () => {
      let data= {user:this.user,products: this.cart}
      if(!data.user || !data.products){
        alert("no user or cart");
        throw new Error(error);
      }
      let order = new Order(data);
      order.makeOrder();
      console.log(order);
    });
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
  
}
new App();
