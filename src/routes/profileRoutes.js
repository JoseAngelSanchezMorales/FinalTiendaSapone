const router = require('express').Router();
const passport = require('passport');
const userSchema = require('../models/userSchema');
const productSchema = require('../models/productSchema')


let car = {
    getListProducts: [],
    totalToPay: 0
}


router.get('/settings/:id', isAuthenticated, async (req, res, next) => {
    const usr = await userSchema.findById(req.params.id)
    res.render('users/profile/settings', {
        page_title: 'Settings',
        path: '/profile/settings',
        user: usr
    })
})

// Actualizar informacion
router.post('/update/:id', isAuthenticated, async (req, res, next) => {
    const findUser = await userSchema.findById(req.params.id);
    findUser.name = req.body.name;
    findUser.lstname = req.body.lstname;
    findUser.email = req.body.email;
    findUser.save();
    res.redirect('/profile')
});

// Ruta para pbtener el carro
router.get('/cart',isAuthenticated, async (req, res, next) => {
 
    const products = await productSchema.find({});

    res.render('users/cart/cart', {
        page_title: 'cart',
        path: '/cart',
        products: products,
        productList: car.getListProducts,
        totalToPay : car.totalToPay
    })
});


// Ruta para agregar un producto al carrito de compras
router.post('/cart/:idProduct', async (req, res, next) => {
    // Tomamos el id de la ruta del producto
    const id = req.params.idProduct;
    // Buscamos el producto
    const prod = await productSchema.findById(id)
    // Agregamos valor del productoa nuestro total
    car.totalToPay = car.totalToPay + +prod.product_price
    // Tomamos el index del producto en caso de que exista
    const existingProductIndex = car.getListProducts.findIndex(
        prod => prod.id === id
    );
    // Tomamos el producto que ya existe
    const existingProduct = car.getListProducts[existingProductIndex];
    let updatedProduct;

    if (existingProduct) { // en caso de que exista el producto
        // Generamos producto secundario
        updatedProduct = { ...existingProduct };
        // aumentamos la cantidad existente
        updatedProduct.qty = updatedProduct.qty + 1;
        // damos valor a nuestro arreglo con los valores anteriores
        car.getListProducts = [...car.getListProducts];
        // Sustituimos le producto anterior por el nuevo pero con el valor aumotado
        car.getListProducts[existingProductIndex] = updatedProduct;
    } else { // En caso de que no exista el producto
        // Agregamos valores por defecto y agregamos al carrito el producto
        updatedProduct = { id: id, qty: 1, name: prod.product_name, price: prod.product_price, description: prod.product_description };
        car.getListProducts = [...car.getListProducts, updatedProduct];
    }
    res.redirect('/cart')
});

// Ruta para eliminar un producto del carrito de compras
router.post('/delete-product/:idProduct', async (req, res, next) => {
    const id = req.params.idProduct;

    const existingProductIndex = car.getListProducts.findIndex(
        prod => prod.id === id
    );

    if(car.getListProducts[existingProductIndex].qty > 1){
        car.getListProducts[existingProductIndex].qty -=  1;
        car.totalToPay = car.totalToPay - car.getListProducts[existingProductIndex].price;
    }else{
        car.totalToPay -= car.getListProducts[existingProductIndex].price;
        car.getListProducts.splice( existingProductIndex , 1)     
    }

    console.log(car.getListProducts)
    res.redirect('/cart')
});


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
}
module.exports = router;