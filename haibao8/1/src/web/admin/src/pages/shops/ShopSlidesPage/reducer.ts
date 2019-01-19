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

export interface ShopSlidesChangeStates {
    error?:                 any;
    inited?:                boolean;
    deleteShopSlideResult?: boolean;
    showDrawer?:            boolean;
    drawerViewStatus?:      number;
    shopSlide?:             Utils.ApiTypes.ShopSlideInfo | null;
}

export interface ShopSlidesStates {
    error:                          any;

    inited:                         boolean;
    
    queryParams:                    QueryParams; 

    showDrawer:                     boolean;
    drawerViewStatus:               number;

    queryShopSlidePageDataPending:  boolean;
    queryShopSlidePageDataResult:   Utils.ApiTypes.ShopSlidePageData | null;

    deleteShopSlidePending:         boolean;
    deleteShopSlideResult:          boolean;

    shopSlide:                      Utils.ApiTypes.ShopSlideInfo | null;
}

export const initialState: ShopSlidesStates = {
    error:                          null,

    inited:                         false,

    queryParams:                    initQueryParams(),

    showDrawer:                     false,
    drawerViewStatus:               0,
    
    queryShopSlidePageDataPending:  false,
    queryShopSlidePageDataResult:   null,

    deleteShopSlidePending:         false,
    deleteShopSlideResult:          false,

    shopSlide:                      null
};

class Combine {
}

export const reducer = (
    state:  ShopSlidesStates = initialState, 
    action: Common.ReducerTool.BaseAction
): ShopSlidesStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};