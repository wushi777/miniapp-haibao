import React                                            from 'react';
import { Provider }                                     from 'react-redux';
import { combineReducers }                              from 'redux';
import { syncHistoryWithStore }                         from 'react-router-redux';
import { LocaleProvider }                               from 'antd';
import zh_CN                                            from 'antd/lib/locale-provider/zh_CN';
import { Router, Route, IndexRoute, browserHistory }    from 'react-router';
import { routerReducer }                                from 'react-router-redux';

import { initStore }                                    from '../store';
import * as Common                                      from '../common';
import * as Utils                                       from '../utils';

import { Root }                                         from './Root';

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

// 按需加载安装页面
const getInstallPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/InstallPage');
        resetPage(page, callback);
    });
};

// 404
const getNotFoundPage = (nextState, callback) => {
    require.ensure([], (require) => {
        const page = require('../pages/NotFoundPage');
        resetPage(page, callback);
    });
};

const history = syncHistoryWithStore(browserHistory, store);

const Routes = () => {
    return (
        <Router history={history} createElement={createElement}>
            <Route path={Utils.routerRootPath} component={Root}>
                <IndexRoute getComponent={getInstallPage} />

                {/* 安装 */}
                <Route path={Utils.routerPaths.install.path}    getComponent={getInstallPage} />
                
                {/* 404页 */}
                <Route path="*"                                 getComponent={getNotFoundPage} />
            </Route>
        </Router>
    );
};

export default Routes;