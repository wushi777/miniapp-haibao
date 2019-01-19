import { stateKey } from './actionTypes';

import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

interface SearchParams {
    search: string;
}

interface QueryParams extends Common.PaginationQueryParams, SearchParams {}

const initQueryParams = (): QueryParams => ({
    ...Common.CommonFuncs.initPaginationQueryParams('posterID', true),
    search: '' 
});

export interface PosterMgrChangeStates {
    error?:                 any;
    inited?:                boolean;
    deletePosterResult?:    boolean;
    showDrawer?:            boolean;
    drawerViewStatus?:      number;
    poster?:                Utils.ApiTypes.PosterInfo | null;
}

export interface PostersMgrStates {
    error:                      any;

    inited:                     boolean;
    
    queryParams:                QueryParams; 

    showDrawer:                 boolean;
    drawerViewStatus:           number;

    queryPosterPageDataPending: boolean;
    queryPosterPageDataResult:  Utils.ApiTypes.PosterInfoPageData | null;

    deletePosterPending:        boolean;
    deletePosterResult:         boolean;

    poster:                     Utils.ApiTypes.PosterInfo | null;
}

export const initialState: PostersMgrStates = {
    error:                      null,

    inited:                     false,

    queryParams:                initQueryParams(),

    showDrawer:                 false,
    drawerViewStatus:           0,
    
    queryPosterPageDataPending: false,
    queryPosterPageDataResult:  null,

    deletePosterPending:        false,
    deletePosterResult:         false,

    poster:                     null
};

class Combine {
}

export const reducer = (
    state:  PostersMgrStates = initialState, 
    action: Common.ReducerTool.BaseAction
): PostersMgrStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};