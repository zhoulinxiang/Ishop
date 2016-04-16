module.exports={
    // some key
    session_secret: 'IShop_Online_Mall',
    auth_cookie_name: 'IShop.com Online Mall',
    encrypt_key: 'IShop',

    // 站点基础信息
    SITE_TITLE: 'Ishop.com Online Mall',
    SITE_DOMAIN: '',
    SITE_ICP: '',
    SYSTEM_MAIL: '',
    SITE_DESCRIPTION: 'an E-Commerce o2o website',
    SITE_KEYWORDS: 'E-Commerce,Ishop,o2o',
    SITE_BASIC_KEYWORDS: '',



    // 系统管理模块
    SYSTEM_MANAGE: new Array('system', 'System Management'),
    USER_MANEGE: new Array('user', 'User Management'),
    AD_MANAGE: new Array('ad', 'Ad Management'),
    CATEGORY_MANAGE: new Array('category', 'Category Management'),
    PRODUCT_MANAGE: new Array('product', 'Product Management'),
    ORDER_MANAGE: new Array('order', 'Order Management'),

    // 用户管理模块
    USER_MANAGE: {
        'user': new Array('user', 'Users Management'),
        'shop_owner': new Array('shop_owner', 'Shop Owner Management'),
        'customer': new Array('customer', 'Customer Management'),
        'blacklist': new Array('blacklist', 'Blacklist Management'),
    },

    // 商家管理模块
    SHOP_MANAGE: {
        'shop': new Array('shop', 'Shop Management'),
        'category': new Array('category', 'Category Management'),
        'commission': new Array('commission', 'Commission Management')
    },

    // 销售管理模块
    SALE_MANAGE: {
        'order': new Array('order', 'Order Management'),
        'sale_history': new Array('sale_history', 'Sale History'),
        'income': new Array('income', 'Income')
    },

    // 首页广告限制
    AD_LIMIT: {
        'product': 4
    }

}