var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
var shortid=require("shortid");
var product=new Scheme({
    product_id:String,
    count:Number
})
var cartScheme=new Scheme({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    products:[product],
    user_id:String
});


var cart=mongoose.model("cart",cartScheme);

//var cart1=new cart({
//    products:[{product_id:"12345",count:12},{product_id:"123456",count:10}],
//    user_id:"1234"
//});
//cart1.save();

module.exports=cart;