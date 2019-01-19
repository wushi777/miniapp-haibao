import { stateKey }     from './actionTypes';
import { ReducerTool }  from '../../common';

export interface SideBarStates {}

export const initialState: SideBarStates = {};

class Combine {
}

export const reducer = (state: SideBarStates = initialState, action: {}): SideBarStates => {
    const newState = ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};