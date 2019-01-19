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

export interface PosterCatsChangeStates {
    error?:                 any;
    inited?:                boolean;
    deletePosterCatResult?: boolean;
    showDrawer?:            boolean;
    posterCat?:             Utils.ApiTypes.PosterCatInfo | null;
}

export interface PosterCatsStates {
    error:                          any;

    inited:                         boolean;
    
    queryParams:                    QueryParams; 

    showDrawer:                     boolean;
    drawerViewStatus:               number;

    queryPosterCatPageDataPending:  boolean;
    queryPosterCatPageDataResult:   Utils.ApiTypes.PosterCatPageData | null;

    deletePosterCatPending:         boolean;
    deletePosterCatResult:          boolean;

    posterCat:                      Utils.ApiTypes.PosterCatInfo | null;
}

export const initialState: PosterCatsStates = {
    error:                          null,

    inited:                         false,

    queryParams:                    initQueryParams(),

    showDrawer:                     false,
    drawerViewStatus:               0,
    
    queryPosterCatPageDataPending:  false,
    queryPosterCatPageDataResult:   null,

    deletePosterCatPending:         false,
    deletePosterCatResult:          false,

    posterCat:                      null
};

class Combine {
}

export const reducer = (
    state:  PosterCatsStates = initialState, 
    action: Common.ReducerTool.BaseAction
): PosterCatsStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};