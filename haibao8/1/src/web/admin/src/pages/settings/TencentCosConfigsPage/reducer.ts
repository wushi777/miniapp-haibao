import { stateKey } from './actionTypes';

import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

export interface TencentCosConfigsStates {
    error:                          any;
    inited:                         boolean;

    getTencentCosConfigsPending:    boolean;
    getTencentCosConfigsResult:     Utils.ApiTypes.TencentCosConfigs | null;

    setTencentCosConfigsPending:    boolean;
    setTencentCosConfigsResult:     boolean;

}

export const initialState: TencentCosConfigsStates = {
    error:                          null,
    inited:                         false,
    
    getTencentCosConfigsPending:    false,
    getTencentCosConfigsResult:     null,

    setTencentCosConfigsPending:    false,
    setTencentCosConfigsResult:     false,
    
};

class Combine {}

export const reducer = (
    state:  TencentCosConfigsStates = initialState, 
    action: Common.ReducerTool.BaseAction
): TencentCosConfigsStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};