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

export interface ShopMgrChangeStates {
    error?:                 any;
    inited?:                boolean;
    // ShopResult?:    boolean;
    showDrawer?:            boolean;
    drawerViewStatus?:      number;
    shop?:                  Utils.ApiTypes.ShopInfo | null;
}

export interface ShopsMgrStates {
    error:                      any;

    inited:                     boolean;
    
    queryParams:                QueryParams; 

    showDrawer:                 boolean;
    // drawerViewStatus:           number;

    queryShopPageDataPending:   boolean;
    queryShopPageDataResult:    Utils.ApiTypes.ShopInfoPageData | null;

    // deleteShopPending:        boolean;
    // deleteShopResult:         boolean;

    shop:                       Utils.ApiTypes.ShopInfo | null;
}

export const initialState: ShopsMgrStates = {
    error:                      null,

    inited:                     false,

    queryParams:                initQueryParams(),

    showDrawer:                 false,
    // drawerViewStatus:           0,
    
    queryShopPageDataPending:   false,
    queryShopPageDataResult:    null,

    // deleteShopPending:        false,
    // deleteShopResult:         false,

    shop:                       null
};

class Combine {
}

export const reducer = (
    state:  ShopsMgrStates = initialState, 
    action: Common.ReducerTool.BaseAction
): ShopsMgrStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};