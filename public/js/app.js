import User from "../model/user.js";
import Product from "../model/product.js";
import Order from "../model/order.js";
class App{
  constructor(){
      this.displayProducts();
      this.user=JSON.parse(sessionStorage.getItem('user'));
      this.cart=JSON.parse(sessionStorage.getItem('cart'));
      this.SignIn();
      this.SignUp();
      this.makeorder();
      this.check();
  }

  SignOut(){
    sessionStorage.clear();
    window.location.href = '/index.html';
  }

  SignIn() {
    try {
      let form = document.querySelector('#signin');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        this.user = await User.signIn(
          form.username.value,
          form.password.value);
        console.log("Sign in successful!", this.user);
        sessionStorage.setItem('user', JSON.stringify(this.user));
        window.location.href = '/products.html';
      });
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  }
  
  SignUp() {
    try {
    let form = document.querySelector('#signup');
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
      window.location.href = '/products.html';
    });
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  }
  check(){
    let but = document.querySelector('#check');
    but.addEventListener('click', async () => {
 
      console.log(this.cart,"\n",this.user);
    });
  }
  makeorder(){
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

  async displayProducts(){
    let arr=[];
    let products= await Product.getProductList();
    const productList = document.querySelector("#productList"); // Assuming an element for the list
    products.forEach((product) => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');

      // Create product details
      const productImage = document.createElement('img');
      productImage.src = product.img;
      productImage.style.width = '25%';
      productImage.style.height = '25%';
      
      const productName = document.createElement('h3');
      productName.textContent = product.name;

      const productPrice = document.createElement('p');
      productPrice.textContent = `Price: $${product.price}`;

      // Handle click event for product details page (replace with actual URL)
      productItem.addEventListener('click', () => {
        arr.push(product);
        sessionStorage.setItem('cart', JSON.stringify(this.cart=arr));
        //window.location.href = `/products/${product.id}`; // Assuming you have product details route
      });

      productItem.appendChild(productImage);
      productItem.appendChild(productName);
      productItem.appendChild(productPrice);
      productList.appendChild(productItem);
    });
  }   


      
}
new App();
