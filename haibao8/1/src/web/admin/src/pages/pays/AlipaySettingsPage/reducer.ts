import { stateKey } from './actionTypes';
import * as Common  from '../../../common';
import * as Utils   from '../../../utils'; 

export interface AlipaySettingsStates {
    error:                      any;
    inited:                     boolean;

    getAlipayConfigsPending:    boolean;
    getAlipayConfigsResult:     Utils.ApiTypes.AlipayConfigs | null;

    setAlipayConfigsPending:    boolean;
    setAlipayConfigsResult:     boolean;
}

export const initialState: AlipaySettingsStates = {
    error:                      null,
    inited:                     false,
    
    getAlipayConfigsPending:    false,
    getAlipayConfigsResult:     null,

    setAlipayConfigsPending:    false,
    setAlipayConfigsResult:     false,
};

class Combine {}

export const reducer = (
    state:  AlipaySettingsStates = initialState, 
    action: Common.ReducerTool.BaseAction
): AlipaySettingsStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};