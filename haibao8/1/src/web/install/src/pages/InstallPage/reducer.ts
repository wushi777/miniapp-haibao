import { stateKey }     from './actionTypes';
import { ReducerTool }  from '../../common';

export interface InstallStates {
    error:                  any;

    activeTabKey:           string;     // 选中的tab
    clearAllData:           boolean;    // 是否清空原数据

    newInstallPending:      boolean;    // 全新安装
    newInstallResult:       any;

    addToClusterPending:    boolean;    // 添加到集群
    addToClusterResult:     any;
}

export const initialState: InstallStates = {
    error:                  null,

    activeTabKey:           '1',
    clearAllData:           true,

    newInstallPending:      false,
    newInstallResult:       null,
    addToClusterPending:    false,
    addToClusterResult:     null
};

class Combine {
}

export const reducer = (
    state:  InstallStates = initialState, 
    action: ReducerTool.BaseAction
): InstallStates => {
    const newState = ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};