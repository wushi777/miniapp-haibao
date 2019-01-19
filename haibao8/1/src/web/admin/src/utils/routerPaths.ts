export const routerRootPath = process.env.NODE_ENV === 'production' ? '/admin/' : '/';

export const routerPaths = {
    login: {
        path:   'login',
        title:  '登录'
    },

    adminCenter: {
        path:   'adminCenter',
        title:  '管理员中心'
    },

    accountsMgr: {
        path:   'accountsMgr',
        title:  '用户管理'
    },

    postersMgr: {
        path:   'postersMgr',
        title:  '海报管理'
    },

    posterCats: {
        path:   'posterCats',
        title:  '分类设置'
    },

    posterSlides: {
        path:   'posterSlides',
        title:  '轮播设置'
    },

    shopsMgr: {
        path:   'shopMgr',
        title:  '店铺管理'
    },

    shopCats: {
        path:   'shopCats',
        title:  '分类设置'
    },

    shopSlides: {
        path:   'shopSlides',
        title:  '轮播设置'
    },

    transactionsMgr: {
        path:   'transactionsMgr',
        title:  '交易管理'
    },

    orderMgr: {
        path:   'orderMgr',
        title:  '订单管理'
    },

    dosageMgr: {
        path:   'dosageMgr',
        title:  '消费记录'
    },

    settings: {
        path:   'settings',
        title:  '系统设置'
    },

    database: {
        path:   'database',
        title:  '数据库配置'
    },

    modifyPassword: {
        path:   'modifyPassword',
        title:  '修改密码'
    },

    paysMgr: {
        path:   'pays',
        title:  '支付设置'
    },

    wxappConfigs: {
        path: 'wxappConfigs',
        title: '微信小程序配置'
    },

    tencentCosConfigs: {
        path: 'tencentCosConfigs',
        title: '腾讯 COS 配置'
    },

    wxpaySettings: {
        path:   'wxpaySettings',
        title:  '微信支付配置'
    },

    alipaySettings: {
        path:   'alipaySettings',
        title:  '支付宝支付配置'
    },

    orderSubject: {
        path:   'orderSubject',
        title:  '商品名称'
    },
    
    priceSettings: {
        path:   'priceSettings',
        title:  '单价配置'
    },

    expMoneySettings: {
        path:   'expMoneySettings',
        title:  '体验金额'
    },

    notFound: {
        path:   'notFound',
        title:  '404'
    }
};