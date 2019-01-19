import { browserHistory }               from 'react-router';

import * as Common                      from '../common';

import { storage }                      from './storage';
import { routerPaths, routerRootPath }  from './routerPaths';

import { 
    ApiTypes,
    AdminsApi,
    SettingsApi,
    OrdersApi,
    DosagesApi,
    AccountsApi,

    PostersApi,
    PosterCatsApi,
    PosterSlidesApi,

    ShopsApi,
    ShopCatsApi,
    ShopSlidesApi
} from '../api';

export {
    ApiTypes
};

const httpConfig: Common.HttpRequestConfig  = {
    needNoTokenAPIs: [
        '/api/admin/login'
    ],

    onNeedAccessToken: (): string => {
        const token = storage.adminAccessToken;
        
        if (!token) {
            // 跳转至登录页面
            browserHistory.push(routerRootPath + routerPaths.login.path);
        }
        return token;
    },

    onAccessTokenError: () => {
        storage.adminAccessToken = '';

        // 跳转至登录页面
        browserHistory.push(routerRootPath + routerPaths.login.path);
    }
};

class Http extends Common.HttpRequest {
    private _adminsApi:         AdminsApi;
    private _settingsApi:       SettingsApi;
    private _dosagesApi:        DosagesApi;
    private _ordersApi:         OrdersApi;
    private _accountsApi:       AccountsApi;

    private _postersApi:        PostersApi;
    private _posterCatsApi:     PosterCatsApi;
    private _posterSlidesApi:   PosterSlidesApi;

    private _shopsApi:          ShopsApi;
    private _shopCatsApi:       ShopCatsApi;
    private _shopSlidesApi:     ShopSlidesApi;

    constructor() {
        super();
        this.init(httpConfig);
        
        this._adminsApi         = new AdminsApi(this);
        this._settingsApi       = new SettingsApi(this);
        this._ordersApi         = new OrdersApi(this);
        this._dosagesApi        = new DosagesApi(this);
        this._accountsApi       = new AccountsApi(this);

        this._postersApi        = new PostersApi(this);
        this._posterCatsApi     = new PosterCatsApi(this);
        this._posterSlidesApi   = new PosterSlidesApi(this);

        this._shopsApi          = new ShopsApi(this);
        this._shopCatsApi       = new ShopCatsApi(this);
        this._shopSlidesApi     = new ShopSlidesApi(this);
    }

    get adminsApi(): AdminsApi {
        return this._adminsApi;
    }

    get settingsApi(): SettingsApi {
        return this._settingsApi;
    }

    get dosagesApi(): DosagesApi {
        return this._dosagesApi;
    }

    get ordersApi(): OrdersApi {
        return this._ordersApi;
    }

    get accountsApi(): AccountsApi {
        return this._accountsApi;
    }

    get postersApi(): PostersApi {
        return this._postersApi;
    }

    get posterCatsApi(): PosterCatsApi {
        return this._posterCatsApi;
    }

    get posterSlidesApi(): PosterSlidesApi {
        return this._posterSlidesApi;
    }

    get shopsApi(): ShopsApi {
        return this._shopsApi;
    }

    get shopCatsApi(): ShopCatsApi {
        return this._shopCatsApi;
    }

    get shopSlidesApi(): ShopSlidesApi {
        return this._shopSlidesApi;
    }
}

export const http = new Http();