import { stateKey }     from './actionTypes';
import * as Common      from '../../common';
// import * as Utils       from '../../utils';

export interface ShopCatChangeStates {
    error?:                 null;
    createShopCatResult?:   null;
    modifyShopCatResult?:   null;
}

export interface  ShopCatDrawerStates {
    error:                  any;

    createShopCatPending:   boolean;
    createShopCatResult:    any;

    modifyShopCatPending:   boolean;
    modifyShopCatResult:    boolean;
}

export const initialState:  ShopCatDrawerStates = {
    error:                  null,

    createShopCatPending:   false,
    createShopCatResult:    null,

    modifyShopCatPending:   false,
    modifyShopCatResult:    false
};

class Combine {}

export const reducer = (
    state:  ShopCatDrawerStates = initialState, 
    action: Common.ReducerTool.BaseAction
):  ShopCatDrawerStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};