export default class Product{
    constructor(data) {
        Object.assign(this,data);
        this.uri=`/api/products/${this.id}`;
    }

    static async getProductList(){
        let products =await(await fetch(`/api/products`)).json();
        return products;
    }
    
    async getProduct(id){
        let products =await(await fetch(`/api/products/${id}`)).json();
        return products;
    }

    async editProduct(data) {
        return await fetch(this.uri, {
          method: 'PATCH', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data), 
        });    
    }
    
    async deleteProduct() {
        return await fetch(this.uri, { method: 'DELETE' });
    }

    async addProduct(data) {
        return await fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data), 
        });
    }
}  