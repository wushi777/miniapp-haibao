import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: Object): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const queryPosterCatPageData = (
    q:      string, 
    sort:   string, 
    desc:   boolean, 
    from:   number, 
    count:  number
): ReducerTool.PromiseAction<Utils.ApiTypes.PosterCatPageData> => {
    const promise   = Utils.http.posterCatsApi.queryPosterCatPageData(q, sort, desc, from, count);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryPosterCatPageDataAction, promise);

    return action;
};

export const deletePosterCat = (
    posterCatID: number
): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.posterCatsApi.deletePosterCat(posterCatID);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseDeletePosterCatAction, promise);

    return action;
};