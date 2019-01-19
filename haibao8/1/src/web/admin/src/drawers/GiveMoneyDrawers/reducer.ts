import { stateKey }     from './actionTypes';
import { ReducerTool }  from '../../common';

export interface GiveMoneyDrawerStates {
    error:                      any;
    inited:                     boolean;

    giveMoneyToAccountPending:  boolean;
    giveMoneyToAccountResult:   boolean;
}

export const initialState: GiveMoneyDrawerStates = {
    error:                      null,
    inited:                     false,

    giveMoneyToAccountPending:  false,
    giveMoneyToAccountResult:   false
};

class Combine {}

export const reducer = (state: GiveMoneyDrawerStates = initialState, action: ReducerTool.BaseAction): GiveMoneyDrawerStates => {
    const newState = ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};