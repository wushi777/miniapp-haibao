import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseGetAdminBaseInfo = (): ReducerTool.PromiseAction<Utils.ApiTypes.AdminInfo> => {
    const promise: Promise<Utils.ApiTypes.AdminInfo> = Utils.http.adminsApi.getAdminBaseInfo();
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetAdminBaseInfoAction, promise);
    return action;
};

export const promiseQueryAccountPageData = (): ReducerTool.PromiseAction<Utils.ApiTypes.AccountInfoPageData> => {
    const promise: Promise<Utils.ApiTypes.AccountInfoPageData> = Utils.http.accountsApi.queryAccountPageData(
        '', 'accountID', false, 0, 1);

    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryAccountPageDataAction, promise);
    return action;
};

export const promiseQueryPosterPageData = (): ReducerTool.PromiseAction<Utils.ApiTypes.PosterInfoPageData> => {
    const promise: Promise<Utils.ApiTypes.PosterInfoPageData> = Utils.http.postersApi.queryPosterPageData(0, 0, 0, '', 'posterID', false, 0, 1);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryPosterPageDataAction, promise);
    return action;
};

export const promiseQueryShopPageData = (): ReducerTool.PromiseAction<Utils.ApiTypes.ShopInfoPageData> => {
    const promise: Promise<Utils.ApiTypes.ShopInfoPageData> = Utils.http.shopsApi.queryShopPageData(0, 0, '', 'shopID', false, 0, 1);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryShopPageDataAction, promise);
    return action;
};