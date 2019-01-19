import { stateKey }     from './actionTypes';
import * as Common      from '../../common';
// import * as Utils       from '../../utils';

export interface PosterCatChangeStates {
    error?:                 null;
    createPosterCatResult?: null;
    modifyPosterCatResult?: null;
}

export interface  PosterCatDrawerStates {
    error:                  any;

    createPosterCatPending: boolean;
    createPosterCatResult:  any;

    modifyPosterCatPending: boolean;
    modifyPosterCatResult:  boolean;

    // posterCat:              Utils.ApiTypes.PosterCatInfo | null;
}

export const initialState:  PosterCatDrawerStates = {
    error:                  null,

    createPosterCatPending: false,
    createPosterCatResult:  null,

    modifyPosterCatPending: false,
    modifyPosterCatResult:  false,

    // posterCat:              null
};

class Combine {}

export const reducer = (
    state:  PosterCatDrawerStates = initialState, 
    action: Common.ReducerTool.BaseAction
):  PosterCatDrawerStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};