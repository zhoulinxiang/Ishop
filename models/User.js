var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
    shortid=require("shortid"),
    url=require("url");
var userScheme=new Scheme({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:String,
    password:String,
    phone:String,
    address:String,
    created:{
        type: Date,
        default: Date.now
    },
    // 购物车
    cart: [
        new Scheme({
            _id: String,
            quantity: Number
        })
    ]
});


var user=mongoose.model("user",userScheme);
user.business={

    insert: function ( req, res ) {
        var Db = require('./db/Db');
        //console.log("insert");
        //console.log(req.body);
        user.findOne( { name: req.body.name }, function ( err, userFind ) {
            if ( userFind ) {
                res.end( userFind.name + ' was already existed.' );
            } else {
                req.body.password =req.body.password;
                Db.addOne( user, req, res, req.body.name + ' join in us.' );
            }
        });
    },

    delete: function ( id, req, res, target ) {
        var Db = require('./db/Db');
        Db.delete(id,user,req,res);
    },
    update: function ( id, req, res ) {
        var Db = require('./db/Db');
        user.findOne( { _id: id}, function ( err, userFind ) {
            if ( err ) {
                console.log(err);
                res.end('error');
            } else {
                Db.updateOneById( id, user, req, res );
            }
        });
    },

    updateByUser: function (req, res) {
        var Db = require('./db/Db'),
            password = url.parse(req.url, true).query.password;

        if (password) {
            user.findOne({ _id: req.session.user._id }, 'password', function (err, userFind) {
                if (userFind) {
                    if (userFind.password === req.body.oldPwd) {
                        if (req.body.newPwd === req.body.confirmNewPwd) {
                            req.body = { password:req.body.newPwd};
                            Db.updateOneById(req.session.user._id, user, req, res);
                        } else {
                            res.end("Twice password you entered is not same.");
                        }
                    } else {
                        res.end("Your enter the old password is not correct.");
                    }
                } else {
                    console.log(err || 'error');
                    res.end('error');
                }
            });
        } else {
            Db.updateOneById(req.session.user._id, user, req, res);
        }
    },

    changeCart: function (req, res) {
        var user_id = req.session.user._id,
            product_id = req.body._id || '',
            quantity = req.body.quantity || 1;
        console.log("user_id:"+user_id);
        console.log("req .body:");
        console.log(req.body);
        user.findOne({ _id: user_id, 'cart._id': product_id }, function (err, userFind) {
            if (userFind) {
                user.update({ _id: user_id, 'cart._id': product_id }, { $inc: { 'cart.$.quantity': quantity } }, function (err) {
                    if (err) {
                        res.end('error');
                        console.log(err);
                    } else {
                        res.end('success');
                    }
                });
            } else {
                user.update({ _id: user_id }, { $push: { cart: req.body } },function (err) {
                    if (err) {
                        console.log(err);
                        res.end('error');
                    } else {
                        res.end('success');
                    }
                });
            }
        });
    },

    deleteCart: function (id, req, res) {
        user.update({ _id: req.session.user._id }, { $pull: { cart: { _id: id } } }, function (err) {
            if (err) {
                res.end('error');
                console.log(err);
            } else {
                res.end('success');
            }
        });
    },



};


//var db=mongoose.connect('mongodb://localhost/ishop');
//var test=new user({
//    name:'111',
//    password:'111',
//    phone:'111'
//});
//test.save();
module.exports=user;