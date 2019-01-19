import * as WxTypes from './WxTypes';

declare const wx;

export class WxUI {
    // 显示消息提示框
    // icon参数的有效值为以下三者之一: 
    // success:	显示成功图标，此时 title 文本最多显示 7 个汉字长度。默认值	
    // loading:	显示加载图标，此时 title 文本最多显示 7 个汉字长度。	
    // none:    不显示图标， 此时 title 文本最多可显示两行
    public static async showToast(
        title:      string,                 // 提示的内容
        icon:       string  = 'success',    // 图标，有效值 "success", "loading", "none"
        image:      string  = '',           // 自定义图标的本地路径，image 的优先级高于 icon
        duration:   number  = 1500,         // 提示的延迟时间，单位毫秒，默认：1500
        mask:       boolean = false,        // 是否显示透明蒙层，防止触摸穿透，默认：false
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.showToast({
                title,
                icon,
                image,
                duration,
                mask,

                success: (res: any) => {
                    resolve();
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    // 隐藏消息提示框
    public static hideToast(): void {
        wx.hideToast();
    }

    // 显示 loading 提示框, 需主动调用 hideLoading 才能关闭提示框
    public static async showLoading(
        title:      string,                 // 提示的内容
        mask:       boolean = false,        // 是否显示透明蒙层，防止触摸穿透，默认：false
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.showLoading({
                title,
                mask,

                success: (res: any) => {
                    resolve();
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    public static hideLoading(): void {
        wx.hideLoading();
    }

    // ​显示模态弹窗
    public static async showModal(
        title:          string,                 // 提示的标题
        content:        string,                 // 提示的内容
        showCancel:     boolean = true,         // 是否显示取消按钮，默认为 true
        cancelText:     string  = '取消',       // 取消按钮的文字，默认为"取消"，最多 4 个字符
        cancelColor:    string  = '#000000',    // 取消按钮的文字颜色，默认为"#000000"
        confirmText:    string  = '确定',         // 确定按钮的文字，默认为"确定"，最多 4 个字符
        confirmColor:   string  = '#3CC51F',    // 确定按钮的文字颜色，默认为"#3CC51F"
    ): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            wx.showModal({
                title,
                content,
                showCancel,
                cancelText,
                cancelColor,
                confirmText,
                confirmColor,

                success: (res: any) => {
                    if (res.confirm) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    // ​​显示操作菜单
    public static async showActionSheet(
        itemList:   string[],               // 按钮的文字数组，数组长度最大为6个
        itemColor:  string  = '#000000',    // 按钮的文字颜色，默认为"#000000"
    ): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            wx.showActionSheet({
                itemList,
                itemColor,

                success: (res: any) => {
                    resolve(res.tapIndex);
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    public static canIUse(str: string): any {
       return (!((typeof wx.canIUse === 'function') && wx.canIUse(str)))
    }

}