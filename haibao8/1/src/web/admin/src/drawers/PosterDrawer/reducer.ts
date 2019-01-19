import { stateKey }     from './actionTypes';
import * as Common      from '../../common';

export interface PosterDrawChangeStates {
    error?:                     null;

    createPosterResult?:        null;
    modifyPosterResult?:        null;

    posterPictureUploading?:    boolean;
    posterThumbUploading?:      boolean;
}

export interface  PosterDrawerStates {
    error:                  any;

    createPosterPending:    boolean;
    createPosterResult:     any;

    modifyPosterPending:    boolean;
    modifyPosterResult:     any;

    getUploadUrlPending:    boolean;
    getUploadUrlResult:     string;

    posterPictureUploading: boolean;
    posterThumbUploading:   boolean;
}

export const initialState:  PosterDrawerStates = {
    error:                  null,

    createPosterPending:    false,
    createPosterResult:     null,

    modifyPosterPending:    false,
    modifyPosterResult:     null,

    getUploadUrlPending:    false,
    getUploadUrlResult:     '',

    posterPictureUploading: false,
    posterThumbUploading:   false
};

class Combine {}

export const reducer = (
    state:  PosterDrawerStates = initialState, 
    action: Common.ReducerTool.BaseAction
):  PosterDrawerStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};