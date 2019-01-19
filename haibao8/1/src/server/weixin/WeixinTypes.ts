import * as Utils from '../utils';

export interface  WxSessionInfo {
    openid:         string;
    session_key:    string;
    unionid?:       string;
}

export interface WxSessionAndUserInfo {
    session:    WxSessionInfo;
    userInfo:   Utils.ApiTypes.WxUserInfo;
}