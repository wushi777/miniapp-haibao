import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class AdminsApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        ////////// 管理员相关  ///////////////////////////////////////////////////
        // 登录
        app.post('/api/admin/login',    this.login);

        // 注销
        app.get('/api/admin/logout',    this.logout);

        // 获取管理员的基本信息
        app.get('/api/admin/baseinfo',  this.getAdminBaseInfo);

        // 修改管理员的基本信息
        app.put('/api/admin/baseinfo',  this.modifyAdminBaseInfo);

        // 修改管理员的密码
        app.put('/api/admin/password',  this.modifyAdminPassword);
    }

    // POST 登录
    private async login(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        if (!Utils.configs.dbInfo.inited) {
            const error = new Error('系统尚未初始化，请联系管理员');
            throw error;
        }

        const adminName:    string  = Common.SysUtils.safeString(req.body.adminName);
        const password:     string  = Common.SysUtils.safeString(req.body.password); //password 为 md5 后的

        if (!adminName) {
            const error = new Error('管理员用户名不能为空');
            throw error;
        }

        const adminInfo: Utils.ApiTypes.AdminInfo = await db.admins.getAdminInfoByAdminName(adminName);

        if (!adminInfo) {
            const error = new Error('管理员用户名不存在');
            throw error;
        }

        const bOk: boolean = await Utils.PasswordUtils.checkPassword(password, adminInfo.password);
        if (!bOk) {
            const error = new Error('密码错误');
            throw error;
        }

        const newLoginTimes:    number  = adminInfo.loginTimes + 1;
        const newLastLoginDate: number  = Common.DateUtils.now();

        await db.admins.modifyAdminLoginInfo(adminInfo.adminID, newLoginTimes, newLastLoginDate);

        const accessToken: string = Common.StrUtils.uuid(Utils.configs.serverUrl);

        adminInfo.ip           = req.ip;
        adminInfo.userAgent    = req.headers['user-agent'];

        await this.setToken(accessToken, adminInfo);

        delete adminInfo.password;

        adminInfo.loginTimes        = newLoginTimes;
        adminInfo.lastLoginDate     = newLastLoginDate;
        adminInfo.lastLoginDateObj  = new Date(newLastLoginDate);

        const data: Utils.ApiTypes.AdminLoginInfo = {
            accessToken,
            adminInfo
        };

        res.sendData(data);
    }

    // GET 注销登录
    private async logout(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        await this.deleteToken(req);
        res.sendSuccess();
    }

    // GET 获取管理员的基本信息
    private async getAdminBaseInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const adminInfo: Utils.ApiTypes.AdminInfo = await db.admins.getAdminInfoByAdminID(token.adminID);
        assert(adminInfo);

        delete adminInfo.password;
        res.sendData(adminInfo);
    }

    // PUT 修改管理员信息
    private async modifyAdminBaseInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);
    
        const params: Utils.ApiTypes.AdminEditableInfo = {};
        if (req.body.adminName !== undefined) {
            params.adminName = Common.SysUtils.safeString(req.body.adminName);
        }

        await db.admins.modifyAdminBaseInfo(token.adminID, params);
        res.sendSuccess();
    }

    // PUT 修改管理员的密码
    private async modifyAdminPassword(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const oldPassword: string = Common.SysUtils.safeString(req.body.oldPassword);
        const newPassword: string = Common.SysUtils.safeString(req.body.newPassword);

        await db.admins.modifyAdminPassword(token.adminID, oldPassword, newPassword);
        res.sendSuccess();
    }
}