import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: Object): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const queryShopPageData = (
    q:      string, 
    sort:   string, 
    desc:   boolean, 
    from:   number, 
    count:  number
): ReducerTool.PromiseAction<Utils.ApiTypes.ShopInfoPageData> => {
    const promise   = Utils.http.shopsApi.queryShopPageData(0, 0, q, sort, desc, from, count);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryShopPageDataAction, promise);

    return action;
};

// export const deleteShop = (shopID: number): ReducerTool.PromiseAction<boolean> => {
//     const promise   = Utils.http.shopsApi.deleteShop(shopID);
//     const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseDeleteShopAction, promise);

//     return action;
// };