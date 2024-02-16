const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 


const orderSchema = new Schema({
    products : [
        {
            product : {type : Object, require : true}, 
            quantity : {type : Number, require : true}
        }
    ], 
    user: {
        name : {type : String, require : true}, 
        email : {type : String, require : true},
        userId : {type : Schema.Types.ObjectId, require : true, ref : 'User'}
    }
}); 

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;