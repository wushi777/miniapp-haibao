import * as ActionTypes from './actionTypes';

import * as Utils       from '../../utils';
import * as Common      from '../../common';

export const changeState = (params: {}): Common.ReducerTool.ChangeStateAction => {
    const action = Common.ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

/**
 * 全新安装
 */
export const promiseNewInstall = (
    mongo:      Utils.ApiTypes.MongoInfo, 
    adminName:  string,
    password:   string, 
    clearAll:   boolean
): Common.ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.installApi.newInstall(mongo, adminName, password, clearAll);
    const action    = Common.ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseNewInstallAction, promise);
    return action;
};

/**
 * 添加到集群
 */
export const promiseAddToCluster = (
    serverUrl:  string, 
    adminName:  string, 
    password:   string
): Common.ReducerTool.PromiseAction<boolean> => {
    const promise   = Utils.http.installApi.addToCluster(serverUrl, adminName, password);
    const action    = Common.ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseAddToClusterAction, promise);
    return action;
};