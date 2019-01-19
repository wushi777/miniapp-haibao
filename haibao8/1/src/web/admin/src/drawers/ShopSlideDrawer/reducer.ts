import { stateKey }     from './actionTypes';
import * as Common      from '../../common';

export interface ShopSlideChangeStates {
    error?:                     null;

    createShopSlideResult?:     null;
    modifyShopSlideResult?:     null;

    shopSlideUploading?:        boolean;
}

export interface ShopSlideDrawerStates {
    error:                      any;

    createShopSlidePending:     boolean;
    createShopSlideResult:      any;

    modifyShopSlidePending:     boolean;
    modifyShopSlideResult:      boolean;

    getUploadUrlPending:        boolean;
    getUploadUrlResult:         string;

    shopSlideUploading:         boolean;
}

export const initialState: ShopSlideDrawerStates = {
    error:                      null,

    createShopSlidePending:     false,
    createShopSlideResult:      null,

    modifyShopSlidePending:     false,
    modifyShopSlideResult:      false,

    getUploadUrlPending:        false,
    getUploadUrlResult:         '',

    shopSlideUploading:         false
};

class Combine {}

export const reducer = (state:  ShopSlideDrawerStates = initialState, action: Common.ReducerTool.BaseAction):  ShopSlideDrawerStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};