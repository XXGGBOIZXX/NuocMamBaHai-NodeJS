import User from './user.js';
import Product from './product.js';

export default class Order {
    constructor(data) {
      this.user = new User(data.user);
      this.products = data.products.map(product=> new Product(product));
      this.total = this.totalPrice();
    }
  
    totalPrice() {
      let total = 0;
      for (const product of this.products) {
        total += product.price;
      }
      return total;
    }

    static async getOrders(){
      let orders =await(await fetch(`/orders`)).json();
      return orders;
    }
    async makeOrder(){
      return await fetch(`/orders`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user:this.user,
          products:this.products ,
          total:this.total
          })
      })
  0  }
}
  