import { stateKey } from './actionTypes';
import * as Common  from '../../../common';

export interface ExpMoneySettingsStates {
    error:                      any;
    inited:                     boolean;

    getDefGiveMoneyFenPending:  boolean;
    getDefGiveMoneyFenResult:   number;

    setDefGiveMoneyFenPending:  boolean;
    setDefGiveMoneyFenResult:   boolean;
}

export const initialState: ExpMoneySettingsStates = {
    error:                      null,
    inited:                     false,
    
    getDefGiveMoneyFenPending:  false,
    getDefGiveMoneyFenResult:   0,

    setDefGiveMoneyFenPending:  false,
    setDefGiveMoneyFenResult:   false,
};

class Combine {}

export const reducer = (
    state:  ExpMoneySettingsStates = initialState, 
    action: Common.ReducerTool.BaseAction
): ExpMoneySettingsStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};