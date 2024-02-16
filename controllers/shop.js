const Order = require("../models/order")
const Product = require("../models/product")

exports.homePage = (req, res, next) => {
    Product.find().then(products => {
      res.render('shop/index', {
         pageTitle : 'Home Page', 
         path : '/',
         prods : products
      })
    }).catch(err => console.log(err))
}


exports.products = (req, res, next) => {
    Product.find().then(products => {
      res.render('shop/index', {
         pageTitle : 'Product Page', 
         path : '/',
         prods : products
      })
    }).catch(err => console.log(err))
}

exports.cart = (req, res, next) => {
   req.user.populate('cart.items.productId').then(user => {
         res.render('shop/cart', {
         pageTitle : 'My Cart', 
         path : '/cart',
         products : user.cart.items
   })
   })

}

exports.saveCart = (req, res, next) => {

   const productId = req.body.productId; 
   Product.findById(productId).then(product => {
    return req.user.addToCart(product)
   }).then(result => {
     res.redirect('/cart')
   }).catch(err => console.log(err));

}

exports.removeCart = (req, res, next) => {
   const productId = req.body.productId; 
   req.user.removeCart(productId).then(() => {
      res.redirect('/cart');
   }).then(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId' : req.user._id}).then(orders => {
      res.render('shop/orders', {
         pageTitle : 'My orders', 
         path : '/orders', 
         orders : orders,
      })
    }).catch(err => console.log(err))
}

exports.createOrder = (req, res, next) => {
   req.user.populate('cart.items.productId').then(user => {
      const products = user.cart.items.map(p => {
         return {product : p.productId._doc, quantity : p.quantity}
      });

      const order = new Order({
         products : products, 
         user : {
            name : req.user.name, 
            email : req.user.email, 
            userId : req.user
         }, 
       
      }); 
     return order.save(); 
   }).then(() => {
      return req.user.clearCart();
      
   }).then(() => {
      res.redirect('/orders'); 
   }).catch(err => console.log(err))
}