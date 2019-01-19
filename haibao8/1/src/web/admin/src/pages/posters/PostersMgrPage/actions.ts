import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: Object): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const queryPosterPageData = (
    q:      string, 
    sort:   string, 
    desc:   boolean, 
    from:   number, 
    count:  number
): ReducerTool.PromiseAction<Utils.ApiTypes.PosterInfoPageData> => {
    const promise   = Utils.http.postersApi.queryPosterPageData(0, 0, 0, q, sort, desc, from, count);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryPosterPageDataAction, promise);

    return action;
};

export const deletePoster = (posterID: number): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.postersApi.deletePoster(posterID);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseDeletePosterAction, promise);

    return action;
};