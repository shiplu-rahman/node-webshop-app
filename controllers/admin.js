const { validationResult } = require("express-validator"); 
const fs = require('fs');


// Models
const Product = require("../models/product");

exports.adminProducts = (req, res, next) => {
    Product.find().then(prods => {
        res.render('admin/products', {
            pageTitle : 'Admin Products', 
            path : '/admin/products', 
            prods : prods
        })
    }).catch(err => console.log(err))

}

exports.addProducts = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle : 'Add a product', 
        path : '/admin/add-product', 
        editing : false, 
        multerError : [],
        errors : []
    })
}

exports.saveProducts = (req, res, next) => {
    const validationErrors = validationResult(req); 

    // console.log(req.files) 

    // const images = req.files; 
    // const variant = [];
    // images.forEach((image, i) => {
    //      variant.push(
    //         {
    //             imageSrc : image.path.replace(/\\/g, '/'), 
    //             imageAlt : req.body.alt[i],
    //             stock : req.body.stock[i], 
    //             color : req.body.color[i]
    //         }
    //      )
    // });

    // console.log(variant);

    if(!validationErrors.isEmpty() || req.fileValidationError)
    {
        const errors = validationErrors.array()
        console.log(errors)
        const sanitizedError =  errors.map(e => {
            return {
                name : e.path, 
                value : e.value, 
                message : e.msg,
            }
        });

      
        if(req.file !== undefined){
            const productPhotoPath = req.file.path;
            fs.unlink(productPhotoPath, () => {})
        }

        return res.render('admin/add-product', {
            pageTitle : 'Add a product', 
            path : '/admin/add-product', 
            editing : false, 
            multerError : req.fileValidationError, 
            errors : sanitizedError
        })
     
    }

    const product = new Product({
        title : req.body.title, 
        price : req.body.price, 
        image : req.file.path.replace(/\\/g, '/'), 
        description : req.body.description, 
        userId : req.user
    })



    product.save().then((result) => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err))
    
}

exports.editProduct = (req, res, next) => {
    Product.findById(req.params.productId).then(product => {
        res.render('admin/edit-product', {
            pageTitle : 'Edit ' + product.title, 
            path : '/admin/products', 
            product : product, 
            editing : true,
        })
    }).catch(err => console.log(err))
}

exports.updateProduct = (req, res, next) => {
  const productId = req.body.productId; 

  Product.findById(productId).then(product => {
    if(req.file !== undefined){
        const productPhotoPath = product.image;
        
        fs.unlink(productPhotoPath, () => {})
        product.image = req.file.path.replace(/\\/g, '/');
    }

    product.title = req.body.title; 
    product.description = req.body.description; 
    product.price = req.body.price; 
    

    return product.save()

  }).then(() => {
    res.redirect('/admin/products');
  }).catch(err => console.log(err))

}

exports.deleteProduct = (req, res, next) => {
    const productId = req.body.productId; 
    Product.findByIdAndDelete(productId).then(product => {
        const productPhotoPath = product.image;
        fs.unlink(productPhotoPath, err => {
       
                res.redirect('/admin/products');
        })
    }).catch(err => console.log(err))
}