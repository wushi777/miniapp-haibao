import * as WxTypes from './WxTypes';

declare const wx;

export class WxStorage {
    // public static async set(key: string, data: any): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         const value: string = JSON.stringify(data);

    //         wx.setStorage({
    //             key, 
    //             value,

    //             success: (): void => {
    //                 resolve();
    //             },

    //             fail: (err: any): void => {
    //                 reject(err);
    //             }
    //         });
    //     });        
    // }

    // public static async get(key: string): Promise<any> {
    //     return new Promise<void>((resolve, reject) => {
    //         wx.getStorage({
    //             key,

    //             success: (data: string): void => {
    //                 try {
    //                     const result: any = JSON.parse(data);
    //                     resolve(result);
    //                 } catch (err) {
    //                     resolve(null);
    //                 }
    //             },

    //             fail: (err: any): void => {
    //                 reject(err);
    //             }
    //         });
    //     });
    // }

    public static setSync(key: string, data: any): void {
        if (data) {
            const value: string = JSON.stringify(data);
            wx.setStorageSync(key, value);
        } else {
            this.removeSync(key);
        }
    }

    public static getSync(key: string): any {
        try {
            const data: string = wx.getStorageSync(key);
            const result: any = JSON.parse(data);
            return result;
        } catch (err) {
            return null;
        }
    }

    // public static async getInfo(): Promise<WxTypes.WxStorageInfo> {
    //     return new Promise<WxTypes.WxStorageInfo>((resolve, reject) => {
    //         wx.getStorageInfo({
    //             success: (data: WxTypes.WxStorageInfo): void => {
    //                 resolve(data);
    //             },

    //             fail: (err: any): void => {
    //                 reject(err);
    //             }
    //         });
    //     });
    // }

    public static getInfoSync(): WxTypes.WxStorageInfo {
        const data: WxTypes.WxStorageInfo = wx.getStorageInfoSync();
        return data;
    }

    // public static async remove(key: string): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         wx.removeStorage({
    //             key,

    //             success: (): void => {
    //                 resolve();
    //             },

    //             fail: (err: any): void => {
    //                 reject(err);
    //             }
    //         });
    //     });
    // }

    public static removeSync(key: string): void {
        wx.removeStorageSync(key);
    }

    // public static async clearStorage(): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         wx.clearStorage({
    //             success: (): void => {
    //                 resolve();
    //             },

    //             fail: (err: any): void => {
    //                 reject(err);
    //             }
    //         });
    //     });
    // }

    public static clearStorageSync(): void {
        wx.clearStorageSync();
    }
}