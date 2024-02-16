const { validationResult } = require("express-validator"); 
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
    service : 'Gmail', 
    host : "smtp.gmail.com", 
    auth : {
        user : 'spu.rahman@gmail.com', 
        pass : 'rudh mzfq upzb isfl'
    }, 
    tls : {rejectUnauthorized :false}
})


// Models
const User = require("../models/user");

exports.login = (req, res, next) => {
    res.render('auth/login', {
        pageTitle : 'Login Page', 
        path : '/login', 
        errors : [], 
        oldInput : {}
    })
}

exports.postLogin = (req, res, next) => {
    const validationErrors = validationResult(req); 
    const email = req.body.email; 
    const password = req.body.password;
    const oldInput = { 
      email : email, 
      password : password
    }
    if(!validationErrors.isEmpty())
    {
       const errors = validationErrors.array(); 
        const sanitizedError =  errors.map(e => {
            return {
                name : e.path, 
                value : e.value, 
                message : e.msg,
            }
        }); 
 
        return res.render('auth/login', {
             pageTitle : 'Login', 
             path : '/login', 
             errors : sanitizedError, 
             oldInput : oldInput
         });
    }

    
    User.findOne({email : email}).then(user => {
        if(user)
        {
            req.session.isAuthenticated = true; 
            req.session.user = user; 
            req.session.save(err => {
                if(!err)
                {
                    res.redirect('/')
                }
            })

                
        }
    }).catch(err => console.log(err))
}

exports.signup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle : 'Sign up', 
        path : '/signup', 
        errors : [], 
        oldInput : {}
    })
}

exports.postSignup = (req, res, next) => {
   const validationErrors = validationResult(req); 
   const name = req.body.name; 
   const email = req.body.email; 
   const password = req.body.password;
   const oldInput = { 
     name : name, 
     email : email, 
     password : password
   }
   if(!validationErrors.isEmpty())
   {
      const errors = validationErrors.array(); 
       const sanitizedError =  errors.map(e => {
           return {
               name : e.path, 
               value : e.value, 
               message : e.msg,
           }
       }); 

        return res.render('auth/signup', {
            pageTitle : 'Sign up', 
            path : '/signup', 
            errors : sanitizedError, 
            oldInput : oldInput
        });
   }


   return bcrypt.hash(password, 12).then(hashedPassword => {
       const user = new User({
            name : name, 
            email : email, 
            password : hashedPassword, 
            role : 'customer',
       }); 
    
       return user.save()
       
    })
    .then(() => {
        // return console.log('i am here');
        res.redirect('/login');
        const mailoptions = {
            from : 'shop@shop.com', 
            to : email, 
            subject : 'Welcome to our shop', 
            html : '<h1>Thank you for registering</h1>'
        }; 

        transporter.sendMail(mailoptions).catch(err => console.log(err))
    }).catch(err => console.log(err))


}

exports.resetPassword = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle : 'Reset Password', 
        path : '/reset',
        errors : []
    })
}

exports.getLink = (req, res, next) => {
    const validationErrors = validationResult(req); 
    const email = req.body.email;
    if(!validationErrors.isEmpty())
    {
        const errors = validationErrors.array(); 
        const sanitizedError = errors.map(e => { 
            return { 
                name : e.path, 
                value : e.value, 
                message : e.msg,
            }
        }); 

        res.render('auth/reset', {
            pageTitle : 'Reset your password', 
            path : '/reset', 
            errors : sanitizedError
        })
    }


    crypto.randomBytes(12, (err, buffer) => {
        if(err)
        {
            res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email : email}).then(user => {
            if(user)
            {
            
               user.resetToken = token; 
               user.resetTokenExpiry = Date.now() + 60*60*1000; 
               user.save().then(() => {
                 res.redirect('/reset')
                 const baseUrl = req.protocol + '://' + req.get('host');
                 const mailoptions = {
                    from : 'shop@shop.com', 
                    to : email, 
                    subject : 'Reset your password', 
                    html : `<h1>Password Reset link ${baseUrl}/reset-now/${token}</h1>`
                }; 
        
                transporter.sendMail(mailoptions).catch(err => console.log(err))
               })
            }
        }).catch(err => console.log(err))
    }); 
    
 
}

exports.resetNow = (req, res, next) => {
    const token  = req.params.token; 
    User.findOne({resetToken : token, resetTokenExpiry : {$gt: Date.now()}}).then(user => {
        if(user)
        {
            res.render('auth/new-password', {
                pageTitle : 'Reset', 
                path : '/reset', 
                userId : user._id, 
                passwordToken : token
            })
        }
    }).catch(err => console.log(err))

}

exports.updatePassword = (req, res, next) => {
    const token = req.body.passwordToken; 
    const userId = req.body.userId; 
    const password = req.body.password; 

    User.findById(userId).then(user => {
        return bcrypt.hash(password, 12).then(hashedPassword => {
            user.password = hashedPassword ; 
            return user.save();
        }).then(() => {
            res.redirect('/login');
        }).catch(er => console.log(err))
    }).catch(err => console.log(errr))
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/')
    })
}