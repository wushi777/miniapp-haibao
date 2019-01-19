import { stateKey } from './actionTypes';
import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

export interface WxpaySettingsStates {
    error:                          any;
    inited:                         boolean;

    getWeChatPayConfigsPending:     boolean;
    getWeChatPayConfigsResult:      Utils.ApiTypes.WxpayConfigs | null;         // 获取微信配置

    setWeChatPayConfigsPending:     boolean;
    setWeChatPayConfigsResult:      boolean;                                    // 设置微信配置
}

export const initialState: WxpaySettingsStates = {
    error:                          null,
    inited:                         false,
    
    getWeChatPayConfigsPending:     false,
    getWeChatPayConfigsResult:      null,

    setWeChatPayConfigsPending:     false,
    setWeChatPayConfigsResult:      false,
};

class Combine {}

export const reducer = (
    state:  WxpaySettingsStates = initialState, 
    action: Common.ReducerTool.BaseAction
): WxpaySettingsStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};