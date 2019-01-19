import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../common';
import * as Utils       from '../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const createPosterCat = (
    posterCatName:  string, 
    posterCatDesc:  string,
    hotspot:        boolean,
    orderNum:       number
): ReducerTool.PromiseAction<number> => {
    const promise = Utils.http.posterCatsApi.createPosterCat(posterCatName, posterCatDesc, hotspot, orderNum);

    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseCreatePosterCatAction, promise);
    return action;
};

export const modifyPosterCat = (
    posterCatID: number, 
    params: Utils.ApiTypes.PosterCatEditableInfo
): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.posterCatsApi.modifyPosterCat(posterCatID, params);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseModifyPosterCatAction, promise);
    return action;
};