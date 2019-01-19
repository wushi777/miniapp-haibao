import { stateKey }     from './actionTypes';
import * as Common      from '../../common';

export interface ShopChangeStates {
    error?:             null;
    reviewShopResult?:  any;
}

export interface  ShopDrawerStates {
    error:                  any;

    reviewShopPending:      boolean;
    reviewShopResult:       any;
}

export const initialState:  ShopDrawerStates = {
    error:                  null,

    reviewShopPending:      false,
    reviewShopResult:       null
};

class Combine {}

export const reducer = (state:  ShopDrawerStates = initialState, action: Common.ReducerTool.BaseAction):  ShopDrawerStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};