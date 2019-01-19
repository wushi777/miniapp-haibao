import * as ApiTypes    from './ApiTypes';
import { ApiHttp }      from './ApiHttp';

export class AccountApi {
    // 登录
    public static async login(
        code:           string, // wx.login()的返回值
        rawData:        string, // wx.getUserInfo()的返回值之一
        signature:      string,	// wx.getUserInfo()的返回值之一
        encryptedData:  string, // wx.getUserInfo()的返回值之一
        iv:             string  // wx.getUserInfo()的返回值之一
    ): Promise<ApiTypes.AccountLoginInfo> {
        const params = {
            code,
            rawData,
            signature,
            encryptedData,
            iv
        };

        const path:     string = '/api/account/login';
        const result:   ApiTypes.AccountLoginInfo = await ApiHttp.post(path, params);
        return result;
    }

    // 退出登录
    public static async logout(accessToken: string): Promise<boolean> {
        const params = {
            accessToken
        };

        const path:     string  = '/api/account/logout';
        const result:   boolean = await ApiHttp.get(path, params);
        return result;
    }

    // 检查accessToken是否有效
    public static async checkAccessToken(
        accessToken: string
    ): Promise<boolean> {
        const params = {
            accessToken
        };

        const path:     string  = '/api/account/checkaccesstoken';
        const result:   boolean = await ApiHttp.get(path, params);
        return result;
    }

    // 获取我的基本信息
    public static async getAccountBaseInfo(
        accessToken: string
    ): Promise<ApiTypes.AccountInfo> {
        const params = {
            accessToken
        };
        
        const path:     string = '/api/account/baseinfo';
        const result:   ApiTypes.AccountInfo = await ApiHttp.get(path, params);
        return result;
    }

    // 修改手机号, 传入手机号密文, 返回手机号明文
    public static async modifyPhoneNumber(
        accessToken:    string,
        encryptedData:  string,
        iv:             string
    ): Promise<ApiTypes.WxPhoneNumberInfo> {
        const params = {
            accessToken,
            encryptedData,
            iv
        };

        const path:     string = '/api/account/phonenumber';
        const result:   ApiTypes.WxPhoneNumberInfo = await ApiHttp.put(path, params);
        return result;
    }

    // 生成小程序二维码, 返回二维码的URL地址
    public static async getWXACode(
        accessToken:    string,
        scene:          string,     // 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式）
        page:           string,     // 必须是已经发布的小程序存在的页面（否则报错），例如 pages/index/index ,根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
        width:          number,     // 二维码的宽度，默认为 430px
        auto_color:     boolean,    // 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调，默认 false
        lineColorR:     number,     // auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示，默认全0
        lineColorG:     number,
        lineColorB:     number,
        is_hyaline:     boolean     // 是否需要透明底色，为true时，生成透明底色的小程序码，默认false
    ): Promise<string> {
        const params = {
            accessToken,
            scene,
            page,
            width,
            auto_color,
            lineColorR,
            lineColorG,
            lineColorB,
            is_hyaline
        };

        const path:     string  = '/api/account/wxacode';
        const result:   string  = await ApiHttp.post(path, params);
        return result;
    }
}