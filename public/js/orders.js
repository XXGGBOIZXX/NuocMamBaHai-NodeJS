import User from './user.js';
import Product from './product.js';

export default class Order {
    constructor(data) {
      this.user = new User(data.user);
      this.products = data.products;//.map(product=> new Product(product));
      this.totalPrice = this.calculateTotalPrice();
    }
  
    calculateTotalPrice() {
      let total = 0;
      for (const product of this.products) {
        total += product.price;
      }
      return total;
    }
    static async getProductList(){
      let orders =await(await fetch(`/orders`)).json();
      return orders;
  }
}
  