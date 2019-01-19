import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../common';
import * as Utils       from '../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const createShopCat = (
    shopCatName:    string, 
    shopCatDesc:    string,
    hotspot:        boolean,
    orderNum:       number
): ReducerTool.PromiseAction<number> => {
    const promise = Utils.http.shopCatsApi.createShopCat(shopCatName, shopCatDesc, hotspot, orderNum);

    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseCreateShopCatAction, promise);
    return action;
};

export const modifyShopCat = (
    shopCatID:  number, 
    params:     Utils.ApiTypes.ShopCatEditableInfo
): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.shopCatsApi.modifyShopCat(shopCatID, params);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseModifyShopCatAction, promise);
    return action;
};