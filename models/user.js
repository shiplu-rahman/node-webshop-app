const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 


const userSchema = new Schema({
    name : {
        type : String, 
        require : true
    }, 
    email : {
        type : String, 
        require : true,
    }, 
    password : {
        type : String, 
        require : true, 
    }, 
    role : {type : String, require :true},
    resetToken : {type : String, require : false}, 
    resetTokenExpiry : {type: Date, require : false},
    cart : {
        items : [
            {
                productId : {type : Schema.Types.ObjectId, require : true, ref : 'Product'}, 
                quantity : {type : Number, require : true}
            }
        ]
    }
}); 


userSchema.methods.addToCart = function(product) {
    console.log(product)
    if(this.cart.items.length === 0)
    {
        this.cart.items = [{productId : product._id, quantity : 1}]; 
    }
    else
    {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
         }); 
         if(cartProductIndex >= 0)
         {
            this.cart.items[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;    
         }
         else 
         {
             const cartProducts = [...this.cart.items]; 
             cartProducts.push({productId : product._id, quantity : 1}); 
             this.cart.items = cartProducts; 
         }
    }
    return this.save();
}

userSchema.methods.removeCart = function(productId) {
    const updatedCart = this.cart.items.filter(up => {
        return up.productId.toString() !== productId.toString(); 
    }); 
    this.cart.items = updatedCart; 
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart.items = []; 
    return this.save();
}


const User = mongoose.model('User', userSchema); 

module.exports = User;