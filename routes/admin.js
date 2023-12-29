const adminController = require('../controllers/admin');
const express = require('express');
const isAuth = require('../MiddleWare/is-auth');
const path = require('path');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',isAuth , adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product' ,isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId' ,isAuth, adminController.getEditProduct);

router.get('/edit-product',isAuth, adminController.getEditProducts);

router.post('/edit-product',isAuth, adminController.postEditProduct);

router.delete('/delete/:productId',isAuth, adminController.deleteProduct);

router.get('/products' , adminController.getProducts);

module.exports = router;
