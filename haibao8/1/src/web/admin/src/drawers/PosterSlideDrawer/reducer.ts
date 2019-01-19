import { stateKey }     from './actionTypes';
import * as Common      from '../../common';

export interface PosterSlideChangeStates {
    error?:                     null;

    createPosterSlideResult?:   null;
    modifyPosterSlideResult?:   null;

    posterSlideUploading?:      boolean;
}

export interface PosterSlideDrawerStates {
    error:                      any;

    createPosterSlidePending:   boolean;
    createPosterSlideResult:    any;

    modifyPosterSlidePending:   boolean;
    modifyPosterSlideResult:    boolean;

    getUploadUrlPending:        boolean;
    getUploadUrlResult:         string;

    posterSlideUploading:       boolean;
}

export const initialState: PosterSlideDrawerStates = {
    error:                      null,

    createPosterSlidePending:   false,
    createPosterSlideResult:    null,

    modifyPosterSlidePending:   false,
    modifyPosterSlideResult:    false,

    getUploadUrlPending:        false,
    getUploadUrlResult:         '',

    posterSlideUploading:       false
};

class Combine {}

export const reducer = (
    state:  PosterSlideDrawerStates = initialState, 
    action: Common.ReducerTool.BaseAction
):  PosterSlideDrawerStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};