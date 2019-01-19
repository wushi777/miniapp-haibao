import { stateKey } from './actionTypes';
import * as Common  from '../../../common';

export interface  ModifyPasswordStates {
    error:                  any;
    inited:                 boolean;

    modifyPasswordPending:  boolean;
    modifyPasswordResult:   boolean;
}

export const initialState:  ModifyPasswordStates = {
    error:                  null,
    inited:                 false,

    modifyPasswordPending:  false,
    modifyPasswordResult:   false
};

class Combine {}

export const reducer = (
    state:  ModifyPasswordStates = initialState, 
    action: Common.ReducerTool.BaseAction
): ModifyPasswordStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};