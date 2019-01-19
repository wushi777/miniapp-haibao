import * as WxTypes from './WxTypes';

declare const wx;

export class WxShare {
    // 获取转发详细信息
    public static async getShareInfo(
        shareTicket:    string, // shareTicket
        timeout:        number  // 超时时间，单位 ms
    ): Promise<WxTypes.WxGetShareInfoResponse> {
        return new Promise<WxTypes.WxGetShareInfoResponse>((resolve, reject) => {
            wx.getShareInfo({
                shareTicket,
                timeout,

                success: (res: WxTypes.WxGetShareInfoResponse) => {
                    resolve(res);
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    // 隐藏转发按钮
    public static async hideShareMenu(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.hideShareMenu({
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // 显示当前页面的转发按钮
    public static async showShareMenu(
        withShareTicket: boolean // 是否使用带 shareTicket 的转发
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.showShareMenu({
                withShareTicket,
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // 更新转发属性
    public static async updateShareMenu(
        withShareTicket: boolean // 是否使用带 shareTicket 的转发
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.updateShareMenu({
                withShareTicket,
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }
}
