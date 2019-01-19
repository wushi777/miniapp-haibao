import { stateKey } from './actionTypes';
import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

export interface AdminCenterStates {
    error:                          any;
    inited:                         boolean;

    getAdminBaseInfoPending:        boolean;
    getAdminBaseInfoResult:         Utils.ApiTypes.AdminInfo | null;   

    queryAccountPageDataPending:    boolean;                               
    queryAccountPageDataResult:     Utils.ApiTypes.AccountInfoPageData | null;

    queryPosterPageDataPending:     boolean;
    queryPosterPageDataResult:      Utils.ApiTypes.PosterInfoPageData | null;

    queryShopPageDataPending:       boolean;
    queryShopPageDataResult:        Utils.ApiTypes.ShopInfoPageData | null;
}

export const initialState: AdminCenterStates = {
    error:                          null,
    inited:                         false,

    getAdminBaseInfoPending:        false,
    getAdminBaseInfoResult:         null,

    queryAccountPageDataPending:    false,
    queryAccountPageDataResult:     null,

    queryPosterPageDataPending:     false,
    queryPosterPageDataResult:      null,

    queryShopPageDataPending:       false,
    queryShopPageDataResult:        null
};

class Combine {
}

export const reducer = (
    state:  AdminCenterStates = initialState, 
    action: Common.ReducerTool.BaseAction
): AdminCenterStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};