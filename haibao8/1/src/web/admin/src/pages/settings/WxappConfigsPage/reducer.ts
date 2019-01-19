import { stateKey } from './actionTypes';
import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

export interface WxappConfigsStates {
    error:                      any;
    inited:                     boolean;

    getWxappConfigsPending:     boolean;
    getWxappConfigsResult:      Utils.ApiTypes.WxappConfigs | null;

    setWxappConfigsPending:     boolean;
    setWxappConfigsResult:      boolean;

}

export const initialState: WxappConfigsStates = {
    error:                      null,
    inited:                     false,
    
    getWxappConfigsPending:     false,
    getWxappConfigsResult:      null,

    setWxappConfigsPending:     false,
    setWxappConfigsResult:      false,
    
};

class Combine {}

export const reducer = (
    state:  WxappConfigsStates = initialState, 
    action: Common.ReducerTool.BaseAction
): WxappConfigsStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};