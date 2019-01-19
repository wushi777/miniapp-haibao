import * as md5         from 'md5';

import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

// 管理员接口
export class AdminsApi extends BaseApi {
    // 登录
    public async login(adminName: string, password: string): Promise<ApiTypes.AdminLoginInfo> {
        const params = {
            adminName,
            password: md5(password).toString()
        };

        const loginInfo: ApiTypes.AdminLoginInfo = await this.http.post('/api/admin/login', params);
        return loginInfo;
    }

    // 注销
    public async logout(): Promise<boolean> {
        const params = {};
        const result: boolean = await this.http.get('/api/admin/logout', params);
        return result;
    }

    // 获取管理员的基本信息
    public async getAdminBaseInfo(): Promise<ApiTypes.AdminInfo> {
        const params = {};
        const adminInfo: ApiTypes.AdminInfo = await this.http.get('/api/admin/baseinfo', params);
        return adminInfo;
    }

    // 修改管理员的基本信息
    public async modifyAdminBaseInfo(params: ApiTypes.AdminEditableInfo): Promise<boolean>  {
        const result: boolean = await this.http.put('/api/admin/baseinfo', params);
        return result;
    }

    // 修改管理员的密码
    public async modifyAdminPassword(oldPassword: string, newPassword: string): Promise<boolean> {
        const params = {
            oldPassword: md5(oldPassword).toString(),
            newPassword: md5(newPassword).toString()
        };

        const result: boolean = await this.http.put('/api/admin/password', params);
        return result;
    }

    public async getUploadFileUrl(): Promise<string> {
        const params = {};
        const result: string = await this.http.get('/api/admin/uploadfileurl', params);
        return result;
    }
}