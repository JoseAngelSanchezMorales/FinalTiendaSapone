const router = require('express').Router();
const passport = require('passport');
const userSchema = require('../models/userSchema');
const productSchema = require('../models/productSchema');
const comprasSchema = require('../models/comprasSchema');
const ordersSchema = require('../models/comprasSchema');
const addressSchema = require('../models/address');
const card = require('../models/card');

let car = {
    getListProducts: [],
    totalToPay: 0
}

let wishes = [];

//Agregar direccion
router.post('/new/card/:id',(req,res,next)=> {
    const newcard = new card(req.body);
    newcard.user = req.params.id;
    newcard.save();
     
     req.flash('success', `Se agrego correctamente la targeta`)
     res.redirect('/profile') 
}); 

//get address 
router.get('/card',(req,res,next) => {
    res.render('users/profile/card',{
        page_title: 'My card',
        path : '/card'
    })
});

//Agregar direccion
router.post('/new/address/:id',(req,res,next)=> {
    const newAddress = new addressSchema(req.body);
     newAddress.user = req.params.id;
     newAddress.save();
     
     req.flash('success', `Se agrego correctamente la direccion`)
     res.redirect('/profile') 
}); 

//get address 
router.get('/address',(req,res,next) => {
    res.render('users/profile/address',{
        page_title: 'My address',
        path : '/address'
    })
});

// get my orders
router.get('/orders/:id', async (req,res,next)=> {
    const id = req.params.id;

    ordersSchema.find({ 'user': id }).populate('productos').exec((err,products) => {
        res.render('users/profile/orders',{
            page_title : `My orders ${products.length}`,
            path : '/orders',
            orders: products
        })
    })   
  
})

//get wish list
router.get('/wishes',  async (req,res,next) => {
    const listwishes = await productSchema.find({
        "wish" : true
    })
    res.render('users/profile/wishes' , {
        page_title : `Wishes ${wishes.length}`,
        path : '/wishes',
        wishes : listwishes
    })
});

// Delete product to wish list
router.post('/delete/wish/:idProduct', async (req,res,next) => {
    const id = req.params.idProduct;
    const product = await productSchema.findById(id);

    const existingProductIndex = car.getListProducts.findIndex(
        prod => prod.id === id
    );
    wishes.splice( existingProductIndex , 1);
    product.wish = false;
    product.save();
    req.flash('success', `Se elimino correctamente`)
    res.redirect('/cart') 
});

router.post('/delete/wish/list/:idProduct', async (req,res,next) => {
    const id = req.params.idProduct;
    const product = await productSchema.findById(id);

    const existingProductIndex = car.getListProducts.findIndex(
        prod => prod.id === id
    );
    wishes.splice( existingProductIndex , 1);
    product.wish = false;
    product.save();
    req.flash('success', `Se elimino correctamente`)
    res.redirect('/wishes') 
});

// Add product to wish list
router.post('/add/wish/:idProduct', async (req,res,next)=> {
    const id = req.params.idProduct;

    const existingProductIndex = wishes.findIndex(
        prod => prod.id === id
    );
    // Tomamos el producto que ya existe
    const existingProduct = car.getListProducts[existingProductIndex];

    if(!existingProduct){
        
        const product = await productSchema.findById(id);
        product.wish = true;
        product.save();

        wishes.push(id);
        req.flash('success', `Producto ${ product.product_name } se agrego correctamente`)
        res.redirect('/cart');
    } else {
        console.log('producto ya en lista de deseos')
        res.redirect('/cart');
    }
})

// Ruta para obtener los settings y cambiar la informacion
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
    req.flash('success', `Se actualizo correctamente`)
    res.redirect('/profile')
});

// Ruta para pbtener el carro
router.get('/cart',isAuthenticated, async (req, res, next) => {
 
    console.log(wishes)

    const products = await productSchema.find({});

    if(wishes.length == 0) {
        products.forEach(prd => {
            prd.wish = false;
            prd.save();
        })
    }

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
    req.flash('success', `Se agrego correctamente`)
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
    req.flash('success', `Se elimino correctamente`)
    res.redirect('/cart')
});

// Ruta Para generar el cobro de los carritos
router.post('/buy/cart/:total/:idUsuario', async (req,res,next)=> {

    const newCompra = new comprasSchema();
    newCompra.user = req.params.idUsuario;
    newCompra.total = req.params.total;
    car.getListProducts.forEach(product => {
        newCompra.productos.push(product.id)
    })
    newCompra.save();
    car.getListProducts = [];
    car.totalToPay = 0;
    req.flash('success', `Se compra satisfactoria`)
    res.redirect('/profile');
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
}

module.exports = router;