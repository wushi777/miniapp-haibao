import * as WxTypes from './WxTypes';

declare const wx;

export class WxOpen {
    public static async login(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            wx.login({
                success: (response: WxTypes.WxLoginResponse) => {
                    if (response.code) {
                        resolve(response.code);
                    } else {
                        reject(response.errMsg);
                    }
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    public static async checkSession(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            wx.checkSession({
                success: () => {
                    resolve(true);
                },

                fail: () => {
                    resolve(false)
                }
            });
        });
    }

    public static async getUserInfo(
        withCredentials:    boolean, 
        lang:               string = 'zh_CN'
    ): Promise<WxTypes.WxGetUserInfoResponse> {
        return new Promise<WxTypes.WxGetUserInfoResponse>((resolve, reject) => {
            wx.getUserInfo({
                withCredentials,
                lang,
                
                success: (response: WxTypes.WxGetUserInfoResponse) => {
                    resolve(response);
                },

                fail: (err: any) => {
                    resolve(err)
                }
            });
        });
    }

    public static async getSetting(
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            wx.getSetting({
                success: (response: any) => {
                    resolve(response.authSetting);
                },

                fail: (err: any) => {
                    resolve(err)
                }
            });
        });
    }
}