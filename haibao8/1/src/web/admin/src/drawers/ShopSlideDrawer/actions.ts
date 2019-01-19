import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../common';
import * as Utils       from '../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const getUploadFileUrl = (): ReducerTool.PromiseAction<string> => {
    const promise   = Utils.http.adminsApi.getUploadFileUrl();
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetUploadUrl, promise);
    return action;
};

export const createShopSlide = (
    shopSlideName:    string, 
    shopSlideDesc:    string, 
    shopSlideUrl:     string, 
    shopSlideLink:    string,
    orderNum:           number
): ReducerTool.PromiseAction<number> => {
    const promise = Utils.http.shopSlidesApi.createShopSlide(
        shopSlideName, shopSlideDesc, shopSlideUrl, shopSlideLink, orderNum);

    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseCreateShopSlideAction, promise);
    return action;
};

export const modifyShopSlide = (
    shopSlideID:    number, 
    params:         Utils.ApiTypes.ShopSlideEditableInfo
): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.shopSlidesApi.modifyShopSlide(shopSlideID, params);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseModifyShopSlideAction, promise);
    return action;
};