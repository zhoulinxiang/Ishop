var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
shortid=require("shortid");

var commentScheme=new Scheme({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    user_id:String,
    product_id:String,
    order_id:String,
    content:String,
    created:{
        type: Date,
        default: Date.now
    }
});


var comment=mongoose.model("comment",commentScheme);


module.exports=comment;