const express = require('express'); 
const {check} = require('express-validator');
const bcrypt = require('bcryptjs');

// Controllers 
const AuthController = require('../controllers/auth');
const User = require('../models/user');

// Validators 
const {registerValidator, loginValidator, resetValidator} = require('../validations/validators')

// Router 
const _ = express.Router();


// Auth Routes 
_.get('/csrf-token', (req, res, next) => {
    res.json({csrfToken : req.csrfToken()})
})
_.get('/login', AuthController.login);
_.post('/login', loginValidator, AuthController.postLogin);  
// _.post('/login', loginValidator, (req, res, next) => {
//     User.findOne({email : req.body.email}).then(user => {
//        if(!user)
//        {
//          return res.json({error : 'Wrong email or password'});
//        }
//         return bcrypt.compare(req.body.password, user.password).then(result => {
//             if(!result)
//             {
//                 return res.json({error : 'Wrong email or password'});
//             }
//           res.json({user : user})
//     })
       
//     }).catch(err => console.log(err))
// });  
_.get('/signup', AuthController.signup); 
_.post('/signup', registerValidator, AuthController.postSignup); 
_.post('/logout', AuthController.logout);
_.get('/reset', AuthController.resetPassword); 
_.post('/reset', resetValidator, AuthController.getLink);
_.get('/reset-now/:token', AuthController.resetNow);   
_.post('/new-password', AuthController.updatePassword);


module.exports = _;