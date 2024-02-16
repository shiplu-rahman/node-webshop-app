const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');


// Models 
const User = require('../models/user');

exports.registerValidator =  [
    check('name').notEmpty().withMessage('Please enter name'), 
    check('email').notEmpty().withMessage('Please enter your email').isEmail().withMessage('Please enter a valid email').custom((value, {req}) => {
        return User.findOne({email : value}).then(user => {
            if(user)
            {
                return Promise.reject('Email already exists');
            }
        })
    }),
    check('password').notEmpty().withMessage('Please enter a password').isLength({min : 6}).withMessage('Minimum 6 characters'), 
    check('confirmPassword').notEmpty().withMessage('Please confirm your password').custom((value, {req}) => {
        if(value !== req.body.password)
        {
            throw new Error('Password confirmation does not match');
        }
        return true
    })
];

exports.loginValidator = [
    check('email').notEmpty().withMessage('Please enter email').isEmail().withMessage('Please enter a valid email').custom(async (value, {req}) => {
        const user = await User.findOne({ email: value });
        if (!user) {
            return Promise.reject('Wrong email or password'); 
        }
        // return true
    }),
    check('password').notEmpty().withMessage('Please Enter a password').custom((value, {req}) => {
        return User.findOne({email : req.body.email}).then(user => {
            if(user)
            {
                return bcrypt.compare(value, user.password).then(result => {
                    if(!result)
                    {
                        return Promise.reject('Wrong email or password')
                    }
                })
            }
        })  
    })
]; 

exports.productValidator = [
    check('title').notEmpty().withMessage('Title must not be empty'), 
    check('price').notEmpty().withMessage('Please enter a price').isNumeric().withMessage('Price must be a number'),
    body('file').custom((value, {req})=> {
        if(!req.file)
        {
            throw new Error('Please upload a file');
        }
        return true
    })
    
]

exports.resetValidator = [
    check('email').notEmpty().withMessage('Please Enter email address').isEmail().withMessage('Please enter a valid email').custom((value, {req})=> {
        return User.findOne({email : value}).then(user => {
            if(!user)
            {
                return Promise.reject('Email does not exist');
            }
        })
    })
]


