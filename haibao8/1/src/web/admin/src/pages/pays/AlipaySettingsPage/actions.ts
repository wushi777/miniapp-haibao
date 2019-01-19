import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: any): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseGetAlipayConfigs = (): ReducerTool.PromiseAction<Utils.ApiTypes.AlipayConfigs> => {
    const promise: Promise<Utils.ApiTypes.AlipayConfigs> = Utils.http.settingsApi.getAlipaySettings();
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetAlipayConfigsAction, promise);
    return action;
};

export const promiseSetAlipayConfigs = (params: Utils.ApiTypes.AlipayConfigs): ReducerTool.PromiseAction<boolean> => {
    const promise: Promise<boolean> = Utils.http.settingsApi.setAlipaySettings(params);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseSetAlipayConfigsAction, promise);
    return action;
};