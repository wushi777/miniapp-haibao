import { stateKey }     from './actionTypes';
import { ReducerTool }  from '../../common';

export interface NotFoundStates {}

export const initialState: NotFoundStates = {};

class Combine {
}

export const reducer = (
    state:  NotFoundStates = initialState, 
    action: ReducerTool.BaseAction
): NotFoundStates => {
    const newState = ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};