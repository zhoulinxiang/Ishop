var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
var shortid=require("shortid");

var categoryScheme=new Scheme({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:String,
});

var category=mongoose.model("category",categoryScheme);

//var categoryTest=new category({
//    name:"电子2"
//});
//categoryTest.save();
category.business={
    insert: function ( req, res ) {
        var Db = require('./db/Db');
        //console.log("insert");
        //console.log(req.body);
        category.findOne( { name: req.body.name }, function ( err, categoryFind ) {
            if ( categoryFind ) {
                res.end( categoryFind.name + ' was already existed.' );
            } else {
                Db.addOne( category, req, res );
            }
        });
    },
    delete: function ( id, req, res, target ) {
        var Db = require('./db/Db');
        Db.delete(id,category,req,res);
    },
    update: function ( id, req, res ) {
        var Db = require('./db/Db');
        category.findOne( { _id: id}, function ( err, productFind ) {
            if ( err ) {
                console.log(err);
                res.end('error');
            } else {
                Db.updateOneById( id, category, req, res );
            }
        });
    },
    find: function ( req, res ) {
        category.find()
            .exec(function (err, data) {
                if (err) {
                    console.log(err);
                    res.end('error');
                    return;
                }
                res.json(data);
            });
    },
    findOne: function ( id, req, res ) {
        category.findOne({ _id: id }, function (err, result) {
            if (err) {
                console.log(err);
                res.end('error');
            } else {
                res.json(result);
            }
        });
    }

};
module.exports=category;
