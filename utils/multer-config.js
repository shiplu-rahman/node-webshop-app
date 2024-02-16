const multer =  require('multer'); 
const path = require('path'); 

const storage = (foldername) => multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, `${foldername}/`)
    }, 
    filename : (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});

const fileFilter = (req, file, cb) => {
      
        const allowedFiletypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
        if(allowedFiletypes.includes(file.mimetype))
        {
            cb(null, true); 
        }
        else 
        {
          req.fileValidationError =   'Allowed file types are jpeg, png, gif and svg';
          cb(null, false, req.fileValidationError)
        }

}

const productSingleFile = multer({storage : storage('public/uploads/products'), fileFilter : fileFilter}).single('image'); 
const productMultipleFile = multer({storage : storage('public/uploads/multiple-products')}).array('images');

module.exports = {productSingleFile, productMultipleFile};

