import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: any): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseGetTencentCosConfigs = (): ReducerTool.PromiseAction<Utils.ApiTypes.TencentCosConfigs> => {
    const promise: Promise<Utils.ApiTypes.TencentCosConfigs> = Utils.http.settingsApi.getTencentCosConfigs();
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetTencentCosConfigsAction, promise);
    return action;
};

export const promiseSetTencentCosConfigs = (
    params: Utils.ApiTypes.TencentCosConfigs
): ReducerTool.PromiseAction<boolean> => {
    const promise: Promise<boolean> = Utils.http.settingsApi.setTencentCosConfigs(params);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseSetTencentCosConfigsAction, promise);
    return action;
};