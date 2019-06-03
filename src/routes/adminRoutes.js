const express = require('express');
const router = express.Router();
const passport = require('passport')
const productSchema = require('../models/productSchema');

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
        if (err) console.log(err)
        else {
            console.log(`${productSave.product_name} register sucseful`)
            res.redirect('/admin/products')
        }
    });
});

router.get('admin/edit-product/:idProducto', async (req, res, next) => {
    const id = req.params.idProducto;
    await Product.findByIdAndDelete(id);
    res.redirect('/admin/products')
});

router.post('admin/edit-product/:idProducto', async (req, res, next) => {
    const id = req.params.idProducto;
    const prod = await Product.findById(id);
    res.render('admin/edit-product', {
        prod: prod,
        page_title: `update ${prod.firstname}`
    });
});

router.get('/admin/login', (req,res,next)=> {
    res.render('admin/signin',{
        page_title : 'Admin signin'
    })
})

router.post('/admin/login', passport.authenticate('local-signin', {
    successRedirect: '/admin',
    failureRedirect: 'admin/signin',
    failureFlash: true
  }));

module.exports = router;