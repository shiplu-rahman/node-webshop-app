const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 

const productSchema = new Schema({
    title : {
        type : String, 
        require : true
    }, 
    price : {
        type : Number,
        require : true,
    },
    image : {
        type : String, 
        require : true
    }, 
    description : {
        type : String, 
        require : false, 
    },
    userId : {
        type : Schema.Types.ObjectId, 
        require : true 
    }
}); 

const Product = mongoose.model('Product', productSchema);

module.exports = Product;