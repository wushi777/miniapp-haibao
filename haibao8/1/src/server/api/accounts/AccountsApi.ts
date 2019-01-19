import * as assert          from 'assert';
import * as path            from 'path';

import * as Common          from '../../common';
import * as Utils           from '../../utils';
import * as db              from '../../db';
import * as Weixin          from '../../weixin';

import * as Base            from '../base';
import { BaseAccountApi }   from './BaseAccountApi';

interface WxSessionAndUserInfo {
    session:    Utils.ApiTypes.WxSessionInfo;
    userInfo:   Utils.ApiTypes.WxUserInfo;
}

export class AccountsApi extends BaseAccountApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // 登录
        app.post('/api/account/login',              this.login);

        // 注销
        app.get('/api/account/logout',              this.logout);

        app.get('/api/account/checkaccesstoken',    this.checkAccessToken);

        // 获取用户的基本信息
        app.get('/api/account/baseinfo',            this.getAccountBaseInfo);

        // 修改手机号信息, 传入手机号密文, 返回手机号明文
        app.put('/api/account/phonenumber',         this.modifyPhoneNumber);

        // 生成小程序二维码
        app.post('/api/account/wxacode',            this.getWXACodeUnlimit);
    }

    // 校验登录数据, 确保客户端传过来的数据没有篡改
    private async verifyLoginData(
        code:           string, 
        rawData:        string,
        signature:      string,
        encryptedData:  string,
        iv:             string
    ): Promise<WxSessionAndUserInfo> {
        const wxappConfigs: Utils.ApiTypes.WxappConfigs = await db.settings.getWxappConfigs();

        // 向微信服务器获取 openid 和 session_key
        const wxSession: Weixin.WeixinTypes.WxSessionInfo = await Weixin.weixinFuncs.jscode2session(
            wxappConfigs.appid, wxappConfigs.appsecret, code);
            
        // 校验签名
        const bOk: boolean = await Weixin.weixinFuncs.verifySignature(
            rawData, signature, wxSession.session_key);

        if (!bOk) {
            const error = new Error('校验签名失败');
            throw error;
        }

        // 校验加密数据
        const decryptedData: Utils.ApiTypes.WxUserInfo = await Weixin.weixinFuncs.decryptData(
            encryptedData, iv, wxSession.session_key);    
            
        if (decryptedData.watermark.appid !== wxappConfigs.appid) {
            const error = new Error('校验加密数据失败');
            throw error;
        }

        // 返回数据
        delete decryptedData.watermark;
        delete decryptedData.openId;

        const result: WxSessionAndUserInfo = {
            session:    wxSession,
            userInfo:   decryptedData
        };

        return result;        
    }

    // POST 登录
    private async login(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        if (!Utils.configs.dbInfo.inited) {
            const error = new Error('系统尚未初始化，请联系管理员');
            throw error;
        }

        // 获取传过来的参数
        const code:             string = Common.SysUtils.safeString(req.body.code);
        const rawData:          string = Common.SysUtils.safeString(req.body.rawData);
        const signature:        string = Common.SysUtils.safeString(req.body.signature);
        const encryptedData:    string = Common.SysUtils.safeString(req.body.encryptedData);
        const iv:               string = Common.SysUtils.safeString(req.body.iv);

        if (!code) {
            const error = new Error('code 不能为空');
            throw error;
        }

        if (!rawData) {
            const error = new Error('rawData 不能为空');
            throw error;
        }

        if (!signature) {
            const error = new Error('signature 不能为空');
            throw error;
        }

        if (!encryptedData) {
            const error = new Error('encryptedData 不能为空');
            throw error;
        }

        if (!iv) {
            const error = new Error('iv 不能为空');
            throw error;
        }

        const sessionAndUserInfo: WxSessionAndUserInfo = await this.verifyLoginData(
            code, rawData, signature, encryptedData, iv);

        const wxSession: Utils.ApiTypes.WxSessionInfo   = sessionAndUserInfo.session;
        const userInfo: Utils.ApiTypes.WxUserInfo       = sessionAndUserInfo.userInfo;

        const accountInfo: Utils.ApiTypes.AccountInfo = await db.accounts.getAccountInfoByOpenID(
            wxSession.openid);

        // 将头像上传到Cos
        let avatarUrlCos: string = accountInfo ? accountInfo.avatarUrlCos : '';
        if (!accountInfo || !accountInfo.avatarUrlCos || accountInfo.userInfo.avatarUrl !== userInfo.avatarUrl) {
            const picContent: any = await Common.JsonHttp.get(userInfo.avatarUrl, {}, false);
            const fileName: string = path.join(__dirname, Common.StrUtils.uuid('') + '.jpg');
            await Common.FileUtils.writeFileBinary(fileName, picContent); 
            try {
                const cosConfigs: Utils.ApiTypes.TencentCosConfigs = await db.settings.getTencentCosConfigs();
                avatarUrlCos = await Weixin.weixinFuncs.uploadFileToCos(cosConfigs, fileName);
            } finally {
                await Common.FileUtils.unlink(fileName);
            }
        }
    
        let newLoginTimes:      number  = 1;
        const newLastLoginDate: number  = Common.DateUtils.now();

        let accountID: number = 0;
        if (accountInfo) {
            accountID = accountInfo.accountID;
            newLoginTimes = accountInfo.loginTimes + 1;

            const params: Utils.ApiTypes.AccountEditableInfo = {
                userInfo,
                avatarUrlCos
            };

            await db.accounts.modifyAccountBaseInfo(accountID, params);
        } else {
            accountID = await db.accounts.createAccount(wxSession.openid, userInfo, avatarUrlCos);
        }

        await db.accounts.modifyAccountLoginInfo(accountID, newLoginTimes, newLastLoginDate);

        const newAccountInfo: Utils.ApiTypes.AccountInfo = await db.accounts.getAccountInfoByAccountID(accountID)

        const accessToken: string = Common.StrUtils.uuid(Utils.configs.serverUrl);

        newAccountInfo.wxSession    = wxSession;
        
        newAccountInfo.ip           = req.ip;
        newAccountInfo.userAgent    = req.headers['user-agent'];

        await this.setToken(accessToken, newAccountInfo);

        const data: Utils.ApiTypes.AccountLoginInfo = {
            accessToken,
            accountInfo: newAccountInfo
        };

        delete data.accountInfo.openid; // 删除openid字段,防止泄密

        res.sendData(data);
    }

    // 检查accessToken是否有效
    private async checkAccessToken(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        let accessTokenOk: boolean = false;

        try {
            const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
            accessTokenOk = !!token;
        } catch (err) {
        }

        res.sendData(accessTokenOk);        
    }

    // GET 注销登录
    private async logout(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        await this.deleteToken(req);
        res.sendSuccess();
    }

    private async modifyPhoneNumber(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const encryptedData:    string = Common.SysUtils.safeString(req.body.encryptedData);
        const iv:               string = Common.SysUtils.safeString(req.body.iv);

        const phoneNumberInfo: Utils.ApiTypes.WxPhoneNumberInfo = await Weixin.weixinFuncs.decryptData(
            encryptedData, iv, token.wxSession.session_key);

        const params: Utils.ApiTypes.AccountEditableInfo = {
            phoneNumberInfo
        }

        await db.accounts.modifyAccountBaseInfo(token.accountID, params);

        res.sendData(phoneNumberInfo);
    }

    // GET 获取当前登录帐号的基本信息
    private async getAccountBaseInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accountInfo: Utils.ApiTypes.AccountInfo = await db.accounts.getAccountInfoByAccountID(token.accountID);
        assert(accountInfo);

        res.sendData(accountInfo);
    }

    private async getWXACodeUnlimit(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const scene:        string  = Common.SysUtils.safeString(req.body.scene);
        const page:         string  = '';// Common.SysUtils.safeString(req.body.page);
        const width:        number  = 300;// Common.SysUtils.safeNumber(req.body.width);
        const auto_color:   boolean = Common.SysUtils.safeBoolean(req.body.auto_color);
        const lineColorR:   number  = Common.SysUtils.safeNumber(req.body.lineColorR);
        const lineColorG:   number  = Common.SysUtils.safeNumber(req.body.lineColorG);
        const lineColorB:   number  = Common.SysUtils.safeNumber(req.body.lineColorB);
        const is_hyaline:   boolean = Common.SysUtils.safeBoolean(req.body.is_hyaline);

        const line_color = {
            r: lineColorR,
            g: lineColorG,
            b: lineColorB
        };

        // 先从数据库中查询,如果查到了,直接用
        const url: string = await db.wxaCodes.getWxaCodeUrl(token.accountID, scene, page, width, auto_color, line_color, is_hyaline);
        if (url) {
            return res.sendData(url);
        }

        // 生成不带个人头像的二维码二进制数据
        const wxappConfigs: Utils.ApiTypes.WxappConfigs = await db.settings.getWxappConfigs();
        const result: any = await Weixin.weixinFuncs.getWXACodeUnlimit(
            wxappConfigs.appid, wxappConfigs.appsecret, scene, page, width, auto_color, line_color, is_hyaline);

        // 将不带头像的二维码二进制数据先保存到临时文件,再上传到COS, 得到不带头像二维码的地址
        const fileName = path.join(__dirname, '../webroot/upload', Common.StrUtils.uuid('') + '.jpg');
        await Common.FileUtils.writeFileBinary(fileName, result);

        let originalUrl: string;
        try {
            const cosConfigs: Utils.ApiTypes.TencentCosConfigs = await db.settings.getTencentCosConfigs();
            originalUrl = await Weixin.weixinFuncs.uploadFileToCos(cosConfigs, fileName);
            originalUrl = originalUrl.replace('cos.ap-beijing', 'picbj');
        } finally {
            await Common.FileUtils.unlink(fileName);
        }

        // 拼接成最终的带头像的二维码(将个人头像贴到二维码中间)
        const accountInfo: Utils.ApiTypes.AccountInfo = await db.accounts.getAccountInfoByAccountID(token.accountID);
        let avatarUrlCos: string = accountInfo.avatarUrlCos;
        avatarUrlCos = avatarUrlCos.replace('cos.ap-beijing', 'picbj');
        avatarUrlCos = avatarUrlCos.replace('https', 'http');
        avatarUrlCos = `${avatarUrlCos}?imageMogr2/iradius/66/format/png`;
        avatarUrlCos = Common.StrUtils.base64Encode(avatarUrlCos);

        const finallyUrl: string = `${originalUrl}?watermark/1/image/${avatarUrlCos}/gravity/center`;

        // 将最终的二维码地址保存到数据库
        await db.wxaCodes.createWxaCode(
            token.accountID, scene, page, width, auto_color, line_color, is_hyaline, finallyUrl);

        res.sendData(finallyUrl);
    }
}
