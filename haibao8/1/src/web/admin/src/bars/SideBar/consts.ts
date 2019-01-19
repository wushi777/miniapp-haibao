import { routerPaths, routerRootPath }  from '../../utils';

const rootPath: string = routerRootPath;

export const menus = [
    {
        title:      routerPaths.adminCenter.title,
        linkTo:     rootPath + routerPaths.adminCenter.path,
        key:        rootPath + routerPaths.adminCenter.path,
        iconType:   'user'
    },

    {
        title:      routerPaths.accountsMgr.title,
        linkTo:     rootPath + routerPaths.accountsMgr.path,
        key:        rootPath + routerPaths.accountsMgr.path + 'folder',
        iconType:   'team',
        sub:        [
            {
                title:      routerPaths.accountsMgr.title,
                linkTo:     rootPath + routerPaths.accountsMgr.path,
                iconType:   'team',
                key:        rootPath + routerPaths.accountsMgr.path
            },
        ]
    },

    {
        title:      routerPaths.postersMgr.title,
        linkTo:     rootPath + routerPaths.postersMgr.path,
        iconType:   'bank',
        key:        rootPath + routerPaths.postersMgr.path + 'folder',
        sub:        [
            {
                title:      routerPaths.postersMgr.title,
                linkTo:     rootPath + routerPaths.postersMgr.path,
                iconType:   'bank',
                key:        rootPath + routerPaths.postersMgr.path
            },

            {
                title:      routerPaths.posterCats.title,
                linkTo:     rootPath + routerPaths.posterCats.path,
                iconType:   'bank',
                key:        rootPath + routerPaths.posterCats.path
            },

            {
                title:      routerPaths.posterSlides.title,
                linkTo:     rootPath + routerPaths.posterSlides.path,
                iconType:   'bank',
                key:        rootPath + routerPaths.posterSlides.path
            }
        ]
    },

    {
        title:      routerPaths.shopsMgr.title,
        linkTo:     rootPath + routerPaths.shopsMgr.path,
        iconType:   'bank',
        key:        rootPath + routerPaths.shopsMgr.path + 'folder',
        sub:        [
            {
                title:      routerPaths.shopsMgr.title,
                linkTo:     rootPath + routerPaths.shopsMgr.path,
                iconType:   'bank',
                key:        rootPath + routerPaths.shopsMgr.path
            },

            {
                title:      routerPaths.shopCats.title,
                linkTo:     rootPath + routerPaths.shopCats.path,
                iconType:   'bank',
                key:        rootPath + routerPaths.shopCats.path
            },
            
            {
                title:      routerPaths.shopSlides.title,
                linkTo:     rootPath + routerPaths.shopSlides.path,
                iconType:   'bank',
                key:        rootPath + routerPaths.shopSlides.path
            }
        ]
    },

    // {
    //     title:      routerPaths.transaction.title,
    //     linkTo:     rootPath + routerPaths.transaction.path,
    //     iconType:   'bank',
    //     key:        rootPath + routerPaths.transaction.path,
    //     sub:        [
    //         {
    //             title:      routerPaths.orderMgr.title,
    //             linkTo:     rootPath + routerPaths.orderMgr.path,
    //             iconType:   'shopping-cart',
    //             key:        rootPath + routerPaths.orderMgr.path
    //         },
    //         {
    //             title:      routerPaths.dosageMgr.title,
    //             linkTo:     rootPath + routerPaths.dosageMgr.path,
    //             iconType:   'profile',
    //             key:        rootPath + routerPaths.dosageMgr.path
    //         }
    //     ]
    // },
    
    {
        title:      routerPaths.settings.title,
        linkTo:     rootPath + routerPaths.settings.path,
        iconType:   'setting',
        key:        rootPath + routerPaths.settings.path,
        sub:        [
            {
                title:      routerPaths.database.title,
                linkTo:     rootPath + routerPaths.database.path,
                iconType:   'database',
                key:        rootPath + routerPaths.database.path
            },

            {
                title:      routerPaths.wxappConfigs.title,
                linkTo:     rootPath + routerPaths.wxappConfigs.path,
                iconType:   'edit',
                key:        rootPath + routerPaths.wxappConfigs.path
            },

            {
                title:      routerPaths.tencentCosConfigs.title,
                linkTo:     rootPath + routerPaths.tencentCosConfigs.path,
                iconType:   'edit',
                key:        rootPath + routerPaths.tencentCosConfigs.path
            },

            {
                title:      routerPaths.modifyPassword.title,
                linkTo:     rootPath + routerPaths.modifyPassword.path,
                iconType:   'edit',
                key:        rootPath + routerPaths.modifyPassword.path
            }
        ]
    },
    {
        title:      routerPaths.paysMgr.title,
        linkTo:     rootPath + routerPaths.paysMgr.path,
        iconType:   'pay-circle-o',
        key:        rootPath + routerPaths.paysMgr.path,
        sub:        [
            {
                title:      routerPaths.wxpaySettings.title,
                linkTo:     rootPath + routerPaths.wxpaySettings.path,
                iconType:   'wechat'
            },
            // {
            //     title:      routerPaths.alipaySettings.title,
            //     linkTo:     rootPath + routerPaths.alipaySettings.path,
            //     iconType:   'alipay'
            // },
            // {
            //     title:      routerPaths.orderSubject.title,
            //     linkTo:     rootPath + routerPaths.orderSubject.path,
            //     iconType:   'lock'
            // },
            // {
            //     title:      routerPaths.priceSettings.title,
            //     linkTo:     rootPath + routerPaths.priceSettings.path,
            //     iconType:   'pay-circle-o'
            // },
            // {
            //     title:      routerPaths.expMoneySettings.title,
            //     linkTo:     rootPath + routerPaths.expMoneySettings.path,
            //     iconType:   'heart-o'
            // }
        ]
    }
];