/*
 * 身份验证对象
 *
 */


var Auth = {

    isLogin: function ( req ) {
        return req.session.logined;
    },

    isCustomer: function ( req ) {
        return Auth.isLogin( req ) && req.session.user.group === 'customer';
    },


    isAdminLogin: function ( req ) {
        return req.session.adminlogined;
    }

};

module.exports = Auth;
