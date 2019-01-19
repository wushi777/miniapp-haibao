import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: Object): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const queryPosterSlidePageData = (
    q:      string, 
    sort:   string, 
    desc:   boolean, 
    from:   number, 
    count:  number
): ReducerTool.PromiseAction<Utils.ApiTypes.PosterSlidePageData> => {
    const promise   = Utils.http.posterSlidesApi.queryPosterSlidePageData(q, sort, desc, from, count);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryPosterSlidePageDataAction, promise);

    return action;
};

export const deletePosterSlide = (
    posterSlideID: number
): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.posterSlidesApi.deletePosterSlide(posterSlideID);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseDeletePosterSlideAction, promise);

    return action;
};