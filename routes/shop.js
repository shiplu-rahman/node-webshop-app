const express = require('express'); 


// Controllers 
const ShopController = require('../controllers/shop');

const _ = express.Router(); 


_.get('/', ShopController.homePage); 
_.get('/products', ShopController.products);
_.get('/cart', ShopController.cart); 
_.post('/cart', ShopController.saveCart);
_.post('/cart-delete-item', ShopController.removeCart);
_.get('/orders', ShopController.getOrders); 
_.post('/create-order', ShopController.createOrder);

module.exports = _;