import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../common';
import * as Utils       from '../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const getUploadFileUrl = (): ReducerTool.PromiseAction<string> => {
    const promise   = Utils.http.adminsApi.getUploadFileUrl();
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetUploadUrl, promise);
    return action;
};

export const createPoster = (
    posterCatIDs:   number[],
    posterName:     string, 
    posterDesc:     string, 
    posterData:     string, 
    posterUrl:      string
    // thumbUrl:       string
): ReducerTool.PromiseAction<number> => {
    const promise: Promise<number> = Utils.http.postersApi.createPoster(
        posterCatIDs, posterName, posterDesc, posterData, posterUrl /*, thumbUrl */ );

    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseCreatePosterAction, promise);
    return action;
};

export const modifyPoster = (
    posterID:   number, 
    params:     Utils.ApiTypes.PosterEditableInfo
): ReducerTool.PromiseAction<boolean> => {
    const promise: Promise<boolean> = Utils.http.postersApi.modifyPoster(posterID, params);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseModifyPosterAction, promise);
    return action;
};