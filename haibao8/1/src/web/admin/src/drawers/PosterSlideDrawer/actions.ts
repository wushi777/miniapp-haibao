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

export const createPosterSlide = (
    posterSlideName:    string, 
    posterSlideDesc:    string, 
    posterSlideUrl:     string, 
    posterSlideLink:    string,
    orderNum:           number
): ReducerTool.PromiseAction<number> => {
    const promise = Utils.http.posterSlidesApi.createPosterSlide(
        posterSlideName, posterSlideDesc, posterSlideUrl, posterSlideLink, orderNum);

    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseCreatePosterSlideAction, promise);
    return action;
};

export const modifyPosterSlide = (
    posterSlideID:  number, 
    params:         Utils.ApiTypes.PosterSlideEditableInfo
): ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.posterSlidesApi.modifyPosterSlide(posterSlideID, params);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseModifyPosterSlideAction, promise);
    return action;
};