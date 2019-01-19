import { stateKey } from './actionTypes';
import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

interface SearchParams {
    search: string;
}

interface QueryParams extends Common.PaginationQueryParams, SearchParams {}

const initQueryParams = (): QueryParams => ({
    ...Common.CommonFuncs.initPaginationQueryParams('shopID', true),
    search: '' 
});

export interface ShopCatsChangeStates {
    error?:                 any;
    inited?:                boolean;
    deleteShopCatResult?:   boolean;
    showDrawer?:            boolean;
    shopCat?:               Utils.ApiTypes.ShopCatInfo | null;
}

export interface ShopCatsStates {
    error:                          any;

    inited:                         boolean;
    
    queryParams:                    QueryParams; 

    showDrawer:                     boolean;
    drawerViewStatus:               number;

    queryShopCatPageDataPending:    boolean;
    queryShopCatPageDataResult:     Utils.ApiTypes.ShopCatPageData | null;

    deleteShopCatPending:           boolean;
    deleteShopCatResult:            boolean;

    shopCat:                        Utils.ApiTypes.ShopCatInfo | null;
}

export const initialState: ShopCatsStates = {
    error:                          null,

    inited:                         false,

    queryParams:                    initQueryParams(),

    showDrawer:                     false,
    drawerViewStatus:               0,
    
    queryShopCatPageDataPending:    false,
    queryShopCatPageDataResult:     null,

    deleteShopCatPending:           false,
    deleteShopCatResult:            false,

    shopCat:                        null
};

class Combine {
}

export const reducer = (
    state:  ShopCatsStates = initialState, 
    action: Common.ReducerTool.BaseAction
): ShopCatsStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};