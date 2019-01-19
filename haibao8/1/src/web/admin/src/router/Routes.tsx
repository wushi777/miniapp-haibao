import React                                            from 'react';
import { Provider }                                     from 'react-redux';
import { combineReducers }                              from 'redux';
import { syncHistoryWithStore }                         from 'react-router-redux';
import { LocaleProvider }                               from 'antd';
import zh_CN                                            from 'antd/lib/locale-provider/zh_CN';
import { Router, Route, IndexRoute, browserHistory }    from 'react-router';
import { routerReducer }                                from 'react-router-redux';

import Root                                             from './Root';
    
import { initStore }                                    from '../store';
import * as Common                                      from '../common';
import * as Utils                                       from '../utils';

import 'moment/locale/zh-cn';

const originalReducers = {
    routing:    routerReducer
};

const store = initStore(originalReducers);

const createElement = (Component, props) => {
    return (
        <Provider store={store}>
            <LocaleProvider locale={zh_CN}>
                <Component {...props} />
            </LocaleProvider>
        </Provider>
    );
};

const resetPage = (page: any, callback): void => {
    const { view, reducer, stateKey, initialState } = page;

    const newInitialState = {
        ...initialState
    };

    if (newInitialState.queryParams) {
        newInitialState.queryParams = {
            ...newInitialState.queryParams,
            ...Common.CommonFuncs.getUrlQueryParams(location.href)
        };

        if (newInitialState.queryParams.desc && typeof newInitialState.queryParams.desc === 'string') {
            newInitialState.queryParams.desc = newInitialState.queryParams.desc === 'true' ? true : false;
        }
    }

    const state = store.getState();

    const resetReducer = combineReducers({
        ...store._reducers,
        [stateKey]: reducer
    });

    store._reducers = {
        ...store._reducers,
        [stateKey]: reducer
    };

    const changeState = {
        ...state,
        [stateKey]: newInitialState
    };
    
    store.reset(resetReducer, changeState);

    callback(null, view);
};

// 按需加载登录页
const getLoginPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/misc/LoginPage');
        resetPage(page, callback);
    });
};

// 管理员中心
const getAdminCenterPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/misc/AdminCenterPage');
        resetPage(page, callback);
    });
};

// 用户管理页面
const getAccountsMgrPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/accounts/AccountMgrPage');
        resetPage(page, callback);
    });
};

// 海报管理页面
const getPostersMgrPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/posters/PostersMgrPage');
        resetPage(page, callback);
    });
};

// 海报分类页面
const getPosterCatsPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/posters/PosterCatsPage');
        resetPage(page, callback);
    });
};

// 海报轮播页面
const getPosterSlidesPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/posters/PosterSlidesPage');
        resetPage(page, callback);
    });
};

// 店铺管理页面
const getShopsMgrPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/shops/ShopsMgrPage');
        resetPage(page, callback);
    });
};

// 店铺分类页面
const getShopCatsPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/shops/ShopCatsPage');
        resetPage(page, callback);
    });
};

// 店铺轮播页面
const getShopSlidesPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/shops/ShopSlidesPage');
        resetPage(page, callback);
    });
};

// 订单管理
const getOrderMgrPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/transactions/OrderMgrPage');
        resetPage(page, callback);
    });
};

// 消费管理
const getDosageMgrPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/transactions/DosageMgrPage');
        resetPage(page, callback);
    });
};

// 数据库配置
const getdatabaseSettingPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/settings/DatabaseSettingsPage');
        resetPage(page, callback);     
    });
};

// 修改密码
const getModifyPasswordPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/settings/ModifyPasswordPage');
        resetPage(page, callback);
    });
};

// 微信小程序配置
const getWxappConfigsPage = (nextState, callback) => {
    require.ensure([], () => {
        const page = require('../pages/settings/WxappConfigsPage');
        resetPage(page, callback);
    });
};

// COS 配置
const getTencentCosConfigsPage = (nextState, callback) => {
    require.ensure([], () => {
        const page = require('../pages/settings/TencentCosConfigsPage');
        resetPage(page, callback);
    });
};

// 微信支付配置
const getWxpaySettingsPage = (nextState, callback) => {
    require.ensure([], () => {
        const page = require('../pages/pays/WxpaySettingsPage');
        resetPage(page, callback);
    });
};

// 支付宝支付配置
const getAlipaySettings = (nextState, callback) => {
    require.ensure([], () => {
        const page = require('../pages/pays/AlipaySettingsPage');
        resetPage(page, callback);
    });
};

// 商品名称
const getOrderSubject = (nextState, callback) => {
    require.ensure([], () => {
        const page = require('../pages/pays/OrderSubjectPage');
        resetPage(page, callback);
    });
};

// 单价配置
const getPriceSettingsPage = (nextState, callback) => {
    require.ensure([], () => {
        const page = require('../pages/pays/PriceSettingsPage');
        resetPage(page, callback);
    });
};

// 体验金额
const getExpMoneySettingsPage = (nextState, callback) => {
    require.ensure([], () => {
        const page = require('../pages/pays/ExpMoneySettingsPage');
        resetPage(page, callback);
    });
};

// 404
const getNotFoundPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/misc/NotFoundPage');
        resetPage(page, callback);
    });
};

const history = syncHistoryWithStore(browserHistory, store);

const requireAuth = (nextState, replace) => {
    const token = Utils.storage.adminAccessToken;
    
    if (!token) {
        // message.error('您还未登录,请先登录');

        browserHistory.push(`${Utils.routerRootPath}${Utils.routerPaths.login.path}`);
    }
};

const Routes = () => {
    return (
        <Router history={history} createElement={createElement}>
            <Route path={Utils.routerRootPath} component={Root}>
                <IndexRoute                                                 getComponent={getAdminCenterPage}           onEnter={requireAuth} />

                {/* 登录 */}
                <Route path={Utils.routerPaths.login.path}                  getComponent={getLoginPage} />

                {/* 管理员中心 */}
                <Route path={Utils.routerPaths.adminCenter.path}            getComponent={getAdminCenterPage}           onEnter={requireAuth} />
               
                {/* 用户管理 */}
                <Route path={Utils.routerPaths.accountsMgr.path}            getComponent={getAccountsMgrPage}            onEnter={requireAuth} />

                {/* 海报管理 */}
                <Route path={Utils.routerPaths.postersMgr.path}             getComponent={getPostersMgrPage}            onEnter={requireAuth} />

                {/* 海报分类设置 */}
                <Route path={Utils.routerPaths.posterCats.path}             getComponent={getPosterCatsPage}            onEnter={requireAuth} />

                {/* 海报轮播设置 */}
                <Route path={Utils.routerPaths.posterSlides.path}           getComponent={getPosterSlidesPage}          onEnter={requireAuth} />

                {/* 店铺管理 */}
                <Route path={Utils.routerPaths.shopsMgr.path}               getComponent={getShopsMgrPage}              onEnter={requireAuth} />

                {/* 店铺分类设置 */}
                <Route path={Utils.routerPaths.shopCats.path}               getComponent={getShopCatsPage}              onEnter={requireAuth} />

                {/* 店铺轮播设置 */}
                <Route path={Utils.routerPaths.shopSlides.path}             getComponent={getShopSlidesPage}            onEnter={requireAuth} />

                {/* 订单管理 */}
                <Route path={Utils.routerPaths.orderMgr.path}               getComponent={getOrderMgrPage}              onEnter={requireAuth} />                

                <Route path={Utils.routerPaths.dosageMgr.path}              getComponent={getDosageMgrPage}             onEnter={requireAuth} />                                

                {/* 数据库配置 */}
                <Route path={Utils.routerPaths.database.path}               getComponent={getdatabaseSettingPage}       onEnter={requireAuth} />                

                {/* 修改密码 */}
                <Route path={Utils.routerPaths.modifyPassword.path}         getComponent={getModifyPasswordPage}        onEnter={requireAuth} />

                {/* 微信小程序配置 */}
                <Route path={Utils.routerPaths.wxappConfigs.path}           getComponent={getWxappConfigsPage}          onEnter={requireAuth} />

                {/* COS 配置 */}
                <Route path={Utils.routerPaths.tencentCosConfigs.path}      getComponent={getTencentCosConfigsPage}          onEnter={requireAuth} />

                {/* 微信支付配置 */}
                <Route path={Utils.routerPaths.wxpaySettings.path}          getComponent={getWxpaySettingsPage}         onEnter={requireAuth} />

                {/* 支付宝支付配置 */}
                <Route path={Utils.routerPaths.alipaySettings.path}         getComponent={getAlipaySettings}            onEnter={requireAuth} />

                {/* 商品名称 */}
                <Route path={Utils.routerPaths.orderSubject.path}           getComponent={getOrderSubject}              onEnter={requireAuth} />                

                {/* 单价配置 */}
                <Route path={Utils.routerPaths.priceSettings.path}          getComponent={getPriceSettingsPage}         onEnter={requireAuth} />
                
                {/* 体验金额 */}
                <Route path={Utils.routerPaths.expMoneySettings.path}       getComponent={getExpMoneySettingsPage}      onEnter={requireAuth} />

                {/* 404页 */}
                <Route path="*"                                             getComponent={getNotFoundPage}              onEnter={requireAuth} />
            </Route>
        </Router>
    );
};

export default Routes;