import { stateKey } from './actionTypes';
import * as Common  from '../../../common';

export interface NotFoundStates {}

export const initialState: NotFoundStates = {};

class Combine {
}

export const reducer = (
    state:  NotFoundStates = initialState, 
    action: Common.ReducerTool.BaseAction
): NotFoundStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};