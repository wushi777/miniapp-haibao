import { browserHistory }               from 'react-router';

import * as Common                      from '../common';

import { storage }                      from './storage';
import { routerPaths, routerRootPath }  from './routerPaths';

import {
    ApiTypes,
    InstallApi
} from '../api';

export {
    ApiTypes
};

const httpConfig: Common.HttpRequestConfig  = {
    needNoTokenAPIs: [
        '/api/install/check',
        '/api/install/new',
        '/api/install/addto'
    ],

    onNeedAccessToken: (): string => {
        const token = storage.accessToken;
        
        if (!token) {
            // 跳转至登录页面
            browserHistory.push(routerRootPath + routerPaths.install.path);
        }
        return token;
    },

    onAccessTokenError: () => {
        storage.accessToken = '';

        // 跳转至登录页面
        browserHistory.push(routerRootPath + routerPaths.install.path);
    }
};

class Http extends Common.HttpRequest {
    private _installApi:    InstallApi;

    constructor() {
        super();
        this.init(httpConfig);

        this._installApi    = new InstallApi(this);
    }

    get installApi(): InstallApi {
        return this._installApi;
    }
}

export const http = new Http();