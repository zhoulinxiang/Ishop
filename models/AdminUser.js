//var mongoose=require("./db/db.js");

var mongoose = require('mongoose'),
    shortid=require("shortid");

var Scheme = mongoose.Schema;

var adminScheme=new Scheme({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:String,
    password:String,
    created:{
        type: Date,
        default: Date.now
    }
});


var adminUser=mongoose.model("adminUser",adminScheme);

//var admin=new adminUser({
//    name:"admin",
//    password:"admin"
//});
//admin.save();

module.exports=adminUser;