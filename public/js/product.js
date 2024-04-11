export default class Product{
    constructor(data) {
        Object.assign(this,data);
        this.uri=`/products/${this.id}`;
    }
    static async getProductList(){
        let products =await(await fetch(`/products`)).json();
        return products;
    }

    async editProduct(data) {
        const response = await fetch(this.uri, {
          method: 'PATCH', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data), 
        });    
    }
    
    async deleteProduct() {
        return await fetch(this.uri, { method: 'DELETE' });
    }

    async addProduct(data) {
    return await fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), 
    });
    }
}  