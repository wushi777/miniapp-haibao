import * as WxTypes from './WxTypes';

declare const wx;

export class WxImage {
    public static async chooseImage(
        count:      number      = 9,                             // 最多可以选择的图片张数，默认9
        sizeType:   string[]    = ['original', 'compressed'],  // original 原图，compressed 压缩图，默认二者都有
        sourceType: string[]    = ['album', 'camera'],         // album 从相册选图，camera 使用相机，默认二者都有
    ): Promise<WxTypes.WxChooseImageResponse> {
        return new Promise<WxTypes.WxChooseImageResponse>((resolve, reject) => {
            wx.chooseImage({
                count,
                sizeType,
                sourceType,

                success: (res: WxTypes.WxChooseImageResponse) => {
                    resolve(res);
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    public static async previewImage(
        current:    string,        //当前显示图片的链接，不填则默认为 urls 的第一张
        urls:       string[]    //需要预览的图片链接列表
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.previewImage({
                current,
                urls,

                success: () => {
                    resolve();
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    public static async getImageInfo(
        src: string
    ): Promise<WxTypes.WxImageInfo> {
        return new Promise<WxTypes.WxImageInfo>((resolve, reject) => {
            wx.getImageInfo({
                src,

                success: (res: WxTypes.WxImageInfo) => {
                    resolve(res);
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    public static async saveImageToPhotosAlbum(
        filePath: string
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            wx.saveImageToPhotosAlbum({
                filePath,

                success: (res: any) => {
                    resolve(res.errMsg);
                },

                fail: (err: any) => {
                    resolve(err);
                }
            });
        });
    }
}