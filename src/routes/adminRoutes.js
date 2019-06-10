const express = require('express');
const router = express.Router();
const passport = require('passport')
const productSchema = require('../models/productSchema');
const messageSchema = require('../models/messagesSchema');
const ordersSchema = require('../models/comprasSchema');



// get my orders
router.get('/admin/orders', async (req,res,next)=> {

    ordersSchema.find({}).populate('productos').exec((err,products) => {
        res.render('users/profile/orders',{
            page_title : `Orders ${products.length}`,
            path : 'admin/orders',
            orders: products
        })
    })   
  
})


router.get('/admin', (req, res, next) => {
    res.render('admin/home', {
        page_title: 'Admin home'
    })
});

router.get('/admin/new/product', (req, res, next) => {
    res.render('admin/add-product', {
        page_title: 'New Product'
    })
});

router.get('/admin/products', async (req, res, next) => {
    const products = await productSchema.find({});

    res.render('admin/products', {
        page_title: 'Products',
        products: products,
        path: '/admin/products'
    })
});

router.post('/new-product', (req, res, next) => {
    const newProduct = new productSchema(req.body);
    newProduct.product_name = newProduct.product_category + " de " + newProduct.product_name;
    newProduct.product_name.toLocaleUpperCase();

    // Guardar nuestro producto a BD
    newProduct.save((err, productSave) => {
        if (err) {
            req.flash('error', 'El producto no se agrego correctamente')
        }
        else {
            req.flash('success', `Producto ${ newProduct.product_name } se agrego correctamente`)
            res.redirect('/admin/products')
        }
    });
});

router.get('/edit/:product/:idProducto', async (req, res, next) => {
    const id = req.params.idProducto;
    const product = await productSchema.findById(id);
    res.render('admin/edit-product', {
        product: product,
        page_title: `update ${product.firstname}`
    });
});

router.post('/edit/:product/:idProducto', async (req, res, next) => {
    const id = req.params.idProducto;
    const product = await productSchema.findById(id);
    product.product_name = req.body.product_name;
    product.product_price = req.body.product_price;
    product.product_image = req.body.product_image;
    product.product_description = req.body.product_description;
    product.product_category = req.body.product_category;
    product.save();

    req.flash('success', `Producto ${ product.product_name } se actualizo correctamente`)
    res.redirect('/admin/products')
});


router.post('/delete/:product/:idProducto', async (req, res, next) => {
    const id = req.params.idProducto;
    await productSchema.findByIdAndDelete(id);
    req.flash('success', `Se elimino correctamente`)
    res.redirect('/admin/products')
});

router.get('/admin/login', (req, res, next) => {
    res.render('admin/signin', {
        page_title: 'Admin signin'
    })
})

router.post('/admin/login', passport.authenticate('local-signin', {
    successRedirect: '/admin',
    failureRedirect: '/admin/signin',
    failureFlash: true
}));

router.get('/admin/messages', async (req, res, next) => {

    const messages = await messageSchema.find({"answered" : false})

    res.render('admin/messages',{
        page_title: 'Messages',
        path : 'admin/messages',
        messages : messages
    });
});

router.post('/answered/:idMessage', async (req, res, next) => {
    const message = await messageSchema.findById(req.params.idMessage);
    message.answered = true;
    message.save()
    req.flash('success', `El mensaje fue contestado correctamente`)
    res.redirect('/admin/Messages')
});

router.post('/send/message', (req,res,next) => {
    const newMessage = new messageSchema(req.body);
    newMessage.answered = false;
    newMessage.save();
    console.log('mensaje guardadp')
    res.redirect('http://localhost:3000/')
    next()
});

router.get('/admin/answer/message/:idMessage', async (req,res,next)=> {
    const message = await messageSchema.findById(req.params.idMessage);
    console.log(message)
    res.render('admin/messageDescription',{
        page_title : 'description',
        message : message
    })
})  


module.exports = router;