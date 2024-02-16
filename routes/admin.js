const express = require('express'); 

// Controller
const AdminController = require('../controllers/admin');

// Multer Config 
const {productSingleFile, productMultipleFile} = require('../utils/multer-config'); 

// Validator 
const { productValidator } = require('../validations/validators');

// Middleware 
const isAuth = require('../middlewares/is-auth');
const isAdmin = require('../middlewares/is-admin');


// Router 
const _ = express.Router(); 


// Admin Routes 
_.get('/products', isAuth, isAdmin, AdminController.adminProducts);
_.get('/add-product', isAuth, isAdmin, AdminController.addProducts); 
_.post('/add-product', isAuth, isAdmin, productSingleFile, productValidator, AdminController.saveProducts);
// _.post('/add-product',  productSingleFile, productValidator, (req, res, next) => {
//     console.log(req.body)
// });
_.get('/edit-product/:productId', isAuth, isAdmin, AdminController.editProduct);
_.post('/edit-product', isAuth, isAdmin, productSingleFile, AdminController.updateProduct);
_.post('/delete-product', isAdmin, AdminController.deleteProduct);


module.exports = _;