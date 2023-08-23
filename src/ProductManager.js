import fs from "fs"

class ProductManager {
    constructor() {
        this.path = "Products.json";
    }
    //consulto si existen productos y guardo en data, si no existe retorno array vacio
    async getProducts(limit) {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8")
                let allProducts = JSON.parse(data);
                if(limit){
                    return allProducts.slice(0, limit);
                }else{
                    return allProducts;
                }
            }else{
                return [];
            }
        } catch (error) {
            return error
        }
    }
    //consulto y sobreescribo los productos con un id autoincrementable
    async addProduct( obj ) { 
        try {
            const productsPrev = await this.getProducts()
            const { title, description, price, thumbnail, code, stock } = obj;
            //valido que todos los campos sean obligatorios
            if (!title || !description || !price || !thumbnail || !code || !stock){
                return console.log("All fields are required")
            }
            //valido que no se repita el campo code
            const validateCode = productsPrev.find((product) => product.code === code);
            if (validateCode){
                return console.log("Product code already exists")
            }
            //asigno id autoincrementable
            let id
            if(!productsPrev.length){
                id = 1
            }else{
                id = productsPrev[productsPrev.length - 1].id +1
            }
            const newProduct = {...obj, id}
            productsPrev.push(newProduct)
            await fs.promises.writeFile(this.path,JSON.stringify(productsPrev));
            return newProduct
        } catch (error) {
            return error
        }
    }
    //Busco un producto por id y lo muestro como objeto
    async getProductById(id){
        try {
            const productsPrev = await this.getProducts()
            const productById = productsPrev.find((item) => item.id === id)
            if(!productById){
                return "Id doesn't exists"
            }
            return productById
        } catch (error) {
            return error
        }
    }
    //busco un producto por id y lo actualizo sobreescribiendo sus campos
    async updateProduct(id, newDataObj){
        try {
            const productsPrev = await this.getProducts()
            const productIndex = productsPrev.findIndex((item)=>item.id === id)
            if(productIndex === -1){
                return console.log("Id doesn't exists")
            }
            const product = productsPrev[productIndex]
            productsPrev[productIndex] = {...product, ...newDataObj}
            await fs.promises.writeFile(this.path, JSON.stringify(productsPrev))
        } catch (error) {
            return error
        }
    }
    //filtro por id generando un nuevo array de productos con el id solicitado
    async deleteProduct(id){
        try {
            const productsPrev = await this.getProducts()
            //busco el producto con el ID 
            const productIndex = productsPrev.findIndex((item) => item.id === id);
            // Si no se encuentra el producto devuelvo un mensaje
            if (productIndex === -1) {
                return console.log("Producto no encontrado. No se pudo eliminar.")
            }
            //elimino el producto del array newDataProducts
            const newDataProducts = productsPrev.filter((item) => item.id !== id)
            // sobreescribo el archivo JSON con la nueva lista de productos
            await fs.promises.writeFile(this.path, JSON.stringify(newDataProducts))
            return console.log("Producto eliminado con éxito.");
        } catch (error) {
            return error
        }
    }
}
//productos y nueva data de prueba
const product1 = {
    title: "fideos",
    description: "descripcion de producto",
    price: 500,
    thumbnail: "image01.jpg",
    code: "001",
    stock: 10
}
const product2 = {
    title: "arroz",
    description: "descripcion de producto",
    price: 300,
    thumbnail: "image02.jpg",
    code: "002",
    stock: 20
}
const newData = {
    title: "aceite"
}

//Para hacer las pruebas
async function prueba (){
    //
    const manager = new ProductManager("Products.json")
    // await manager.addProduct(product1)
    // const products = await manager.getProducts()
    // const products = await manager.getProductById(2)
    // console.log(products)
    // await manager.deleteProduct(1)
    // await manager.updateProduct(1, newData)

}
prueba()
const productManager = new ProductManager("Products.json")
export default productManager