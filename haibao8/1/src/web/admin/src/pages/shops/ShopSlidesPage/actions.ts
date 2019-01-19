import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: Object): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const queryShopSlidePageData = (
    q:      string, 
    sort:   string, 
    desc:   boolean, 
    from:   number, 
    count:  number
): ReducerTool.PromiseAction<Utils.ApiTypes.ShopSlidePageData> => {
    const promise   = Utils.http.shopSlidesApi.queryShopSlidePageData(q, sort, desc, from, count);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryShopSlidePageDataAction, promise);

    return action;
};

export const deleteShopSlide = (
    shopSlideID: number
): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.shopSlidesApi.deleteShopSlide(shopSlideID);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseDeleteShopSlideAction, promise);

    return action;
};