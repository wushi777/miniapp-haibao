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

export interface PosterSlidesChangeStates {
    error?:                 any;
    inited?:                boolean;
    deletePosterSlideResult?: boolean;
    showDrawer?:            boolean;
    drawerViewStatus?:      number;
    posterSlide?:             Utils.ApiTypes.PosterSlideInfo | null;
}

export interface PosterSlidesStates {
    error:                          any;

    inited:                         boolean;
    
    queryParams:                    QueryParams; 

    showDrawer:                     boolean;
    drawerViewStatus:               number;

    queryPosterSlidePageDataPending:  boolean;
    queryPosterSlidePageDataResult:   Utils.ApiTypes.PosterSlidePageData | null;

    deletePosterSlidePending:         boolean;
    deletePosterSlideResult:          boolean;

    posterSlide:                      Utils.ApiTypes.PosterSlideInfo | null;
}

export const initialState: PosterSlidesStates = {
    error:                          null,

    inited:                         false,

    queryParams:                    initQueryParams(),

    showDrawer:                     false,
    drawerViewStatus:               0,
    
    queryPosterSlidePageDataPending:  false,
    queryPosterSlidePageDataResult:   null,

    deletePosterSlidePending:         false,
    deletePosterSlideResult:          false,

    posterSlide:                      null
};

class Combine {
}

export const reducer = (
    state:  PosterSlidesStates = initialState, 
    action: Common.ReducerTool.BaseAction
): PosterSlidesStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};