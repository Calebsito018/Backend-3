import express from "express"
import productManager from "./ProductManager.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//mostrar todos los productos o cantidad por limit
app.get("/products",async(req, res) =>{
    const limit = req.query.limit
    try {
        const products = await productManager.getProducts(limit)
        res.status(200).json({ messaje:"productos", products})
    } catch (error) {
        res.status(500).json({error})
    }
})
//mostrar productos por id
app.get("/products/:pid",async(req, res) =>{
    // console.log(req.params)
    const {pid} = req.params
    try {
        const product = await productManager.getProductById(+pid)
        res.status(200).json({ messaje:"producto", product})
    } catch (error) {
        res.status(500).json({error})
    }
})

app.listen(8080, ()=>{
    console.log("escuchando al puerto  8080");
})
