import { stateKey } from './actionTypes';

import * as Common  from '../../../common';

export interface DatabaseSettingsStates {
    error:              any;
    inited:             boolean;

    getDBInfoPending:   boolean; // 获取DB配置
    getDBInfoResult:    any;
}

export const initialState: DatabaseSettingsStates = {
    error:              null,
    inited:             false,

    getDBInfoPending:   false,
    getDBInfoResult:    null,
};

class Combine {}

export const reducer = (
    state:  DatabaseSettingsStates = initialState, 
    action: Common.ReducerTool.BaseAction
): DatabaseSettingsStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};