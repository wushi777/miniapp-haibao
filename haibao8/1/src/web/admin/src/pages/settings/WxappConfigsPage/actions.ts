import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: any): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseGetWxappConfigs = (): ReducerTool.PromiseAction<Utils.ApiTypes.WxappConfigs> => {
    const promise: Promise<Utils.ApiTypes.WxappConfigs> = Utils.http.settingsApi.getWxappConfigs();
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetWxappConfigsAction, promise);
    return action;
};

export const promiseSetWxappConfigs = (
    params: Utils.ApiTypes.WxappConfigs
): ReducerTool.PromiseAction<boolean> => {
    const promise: Promise<boolean> = Utils.http.settingsApi.setWxappConfigs(params);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseSetWxappConfigsAction, promise);
    return action;
};