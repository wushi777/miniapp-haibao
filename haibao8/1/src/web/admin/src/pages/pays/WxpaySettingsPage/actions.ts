import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: any): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseGetWeChatPayConfigs = (): ReducerTool.PromiseAction<Utils.ApiTypes.WxpayConfigs> => {
    const promise: Promise<Utils.ApiTypes.WxpayConfigs> = Utils.http.settingsApi.getWxpaySettings();
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetWeChatPayConfigsAction, promise);
    return action;
};

export const promiseSetWeChatPayConfigs = (params: Utils.ApiTypes.WxpayConfigs): ReducerTool.PromiseAction<boolean> => {
    const promise: Promise<boolean> = Utils.http.settingsApi.setWxpaySettings(params);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseSetWeChatPayConfigsAction, promise);
    return action;
};