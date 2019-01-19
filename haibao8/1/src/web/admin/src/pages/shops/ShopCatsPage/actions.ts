import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: Object): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const queryShopCatPageData = (
    q:      string, 
    sort:   string, 
    desc:   boolean, 
    from:   number, 
    count:  number
): ReducerTool.PromiseAction<Utils.ApiTypes.ShopCatPageData> => {
    const promise   = Utils.http.shopCatsApi.queryShopCatPageData(q, sort, desc, from, count);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryShopCatPageDataAction, promise);

    return action;
};

export const deleteShopCat = (
    shopCatID: number
): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.shopCatsApi.deleteShopCat(shopCatID);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseDeleteShopCatAction, promise);

    return action;
};