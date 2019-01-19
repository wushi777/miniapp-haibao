import { stateKey } from './actionTypes';
import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

export interface LoginStates {
    error:          any;

    loginPending:   boolean;
    loginResult:    Utils.ApiTypes.AdminLoginInfo | null;
}

export const initialState: LoginStates = {
    error:          null,

    loginPending:   false,
    loginResult:    null
};

export interface LoginChangeState {
    error?:         Object | null;
    loginResult?:   Object | null;
}

class Combine {}

export const reducer = (
    state:  LoginStates = initialState, 
    action: Common.ReducerTool.BaseAction
): LoginStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};