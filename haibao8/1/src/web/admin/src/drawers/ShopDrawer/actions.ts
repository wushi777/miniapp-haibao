import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../common';
import * as Utils       from '../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const reviewShop = (
    shopID:         number,
    reviewStatus:   Utils.ApiTypes.ReviewStatusEnum,
    rejectReason:   string
): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.shopsApi.reviewShop(shopID, reviewStatus, rejectReason);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseReviewShopAction, promise);
    return action;
};