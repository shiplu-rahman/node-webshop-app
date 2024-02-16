const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session); 
const csrf = require('csurf');
const cors = require('cors'); 


// App initialization 
const app = express();
const port = 3000;
const MONGO_URI = 'mongodb+srv://dell:L6E4iGhCXAZavlC7@cluster0.efmvptt.mongodb.net/shop?';
const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions', 
});
const csrfProtection = csrf();



// Custom File import 
const rootDir = require('./utils/path');

// Models 
const User = require('./models/user');


// Controllers 
const ErrorController = require('./controllers/error');

// Router import 
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


// Set view engine 
app.set('view engine', 'ejs');
app.set('views', 'views');


// Middlewares 
app.use(express.static(path.join(rootDir, 'public')));
app.use(express.static(path.join(rootDir, '')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors())
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use(csrfProtection);
app.use((req, res, next) => {
    if(!req.session.user)
    {
        return next();
    }
    User.findById(req.session.user._id).then(user => {
        if(user)
        {
            req.user = user
            next();
        }
    }).catch(err => console.log(err))
})



// Global Variables 
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken()
    res.locals.isRole = req.session.user?.role || 'customer'
    next()
})

// Routes 
app.use(authRoutes);
app.use('/admin/', adminRoutes);
app.use(shopRoutes);
app.use(ErrorController.abort404)



// Database connection 
mongoose.connect(MONGO_URI).then(result => {
    app.listen(port, ['192.168.1.111' || 'localhost'])
}).catch(err => console.log(err))