var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
var shortid=require("shortid");


var product=new Scheme({
    product_id:String,
    price:Number,
    count:Number
})
var orderScheme=new Scheme({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    products:[product],
    user_id:String,
    total:Number,
    created:{
        type: Date,
        default: Date.now
    },
    name:String,
    phone:String,
    address:String,
    state:Number//-1:待确认 0:已下单 submit 1：已支付 pay 2：已发货 shipping 3：已完成 received 4: 申请退货 5：同意退货 6：退货成功
});


var Order=mongoose.model("Order",orderScheme);

Order.business = {

    insert: function (req, res) {
        var orderInfo=req.body.orderInfo;
        console.log("orderInfo:");
        console.log(orderInfo);
        var order = new Order();
        order.user_id = req.session.user._id;
        order.products = orderInfo.products;
        order.total = orderInfo.total;
        order.state=-1;
        order.name=orderInfo.name;
        order.phone=orderInfo.phone;
        order.address=orderInfo.address;
        order.save(function (err) {
            if (err) {
                console.log(err);
                res.end('error');
            } else {
                res.end('success');
            }
        });
    },
    findConfirmOne:function(req,res){
        var userId=req.session.user._id;
        Order.findOne({user_id:userId,state:-1}).sort('-date').exec(function(err,result){
            console.log(result);
            res.json(result);
        })
    },
    findByUser:function(req,res){
        var Db = require('./db/Db'),
            conditions = {};
            conditions['user_id'] = req.session.user._id;

        Db.pagination(Order, req, res, [conditions]);
    },
    update: function (id, operate, req, res) {
        var Db = require('./db/Db');
        var User = require('./User');
        var Product = require('./Product');
        var SiteUtils = require('../utils/SiteUtils');
        //var user_id = req.session.user._id;
        console.log("id:");
        console.log(id);
        console.log("operate:");
        console.log(operate);
        switch (operate) {
            case 'confirm':
                var update = {
                    state: 0
                };
                Order.update({ _id: id}, { $set: update }, function (err) {
                    if (err) {
                        console.log(err);
                        res.end('error');
                        return;
                    }
                    Order.findOne({ _id: id, state: '0' }, function (err, order) {
                        if (err) {
                            console.log(err);
                            res.end('error');
                        }
                        if (!order) {
                            res.end('No the order here.');
                            return;
                        }
                        // 从购物车中删除
                        (function rmCart(i) {
                            if (i === order.products.length) {
                                res.end('success');
                                return;
                            }
                            User.update({ _id: req.session.user._id }, { $pull: { cart: { _id: order.products[i].product_id } } },function (err) {
                                if (err) {
                                    console.log(err);
                                    res.end('error');
                                } else {
                                    rmCart(i + 1);
                                }
                            })
                        })(0);
                    });
                });
                break;
            case 'pay':
                updateOrder({ _id: id, state: 0}, { state: 1 });
                break;
            case 'shipping':
                updateOrder({ _id: id,  state: 1 }, { state: 2 }, function (err) {
                    if (err) {
                        res.end('error');
                    } else {
                        Order.findOne({ _id: id, state: 2 }, function (err, order) {
                            if (err) {
                                console.log(err);
                                res.end('error');
                            }
                            // bug here
                            if (!order) {
                                res.end('No the order here.');
                                return;
                            }
                            console.log("orderProducts");
                            console.log(order.products);
                             //从产品库存中删除
                            (function reduceStorage(i) {
                                if (i === order.products.length) {
                                    return;
                                }

                                SiteUtils.incStorage(order.products[i].product_id , -order.products[i].count, function (err) {
                                    if (err) {
                                        console.log(err);
                                        res.end('error');
                                    } else {
                                        reduceStorage(i + 1);
                                    }
                                })
                            })(0);

                            //// 更新shop nSaled
                            //SiteUtils.incSaled(order.shop._id, order.products.length);
                            res.end('success');
                        });
                    }
                });
                break;
            case 'received':
                updateOrder({ _id: id, state: 2 }, { state: 3}, function (err) {
                    if (err) {
                        res.end('error');
                    } else {
                        res.end('success');
                    }
                });
                break;
            case 'return':
                updateOrder({ _id: id, state: 3 }, { state: 4}, function (err) {
                    if (err) {
                        res.end('error');
                    } else {
                        res.end('success');
                    }
                });
                break;
            case 'confirmreturn':
                updateOrder({ _id: id, state: 4 }, { state: 5}, function (err) {
                    if (err) {
                        res.end('error');
                    } else {
                        res.end('success');
                    }
                });
                break;
            case 'returndone':
                updateOrder({ _id: id, state: 5 }, { state: 6}, function (err) {
                    if (err) {
                        res.end('error');
                    } else {
                        res.end('success');
                    }
                });
                break;
            default:
                res.end('Error Operation.');
                break;
        }

        function updateOrder(selector, update, callback) {
            Order.update(selector, { $set: update }, function (err) {
                if (err) {
                    console.log(err);
                    callback ? callback(err) : res.end('error');
                } else {
                    callback ? callback() : res.end('success');
                }
            });
        }

    },

};

module.exports=Order;