import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class AdminsDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.adminsTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.adminID;
    }

    //根据adminName获取管理员信息
    public async getAdminInfoByAdminName(adminName: string): Promise<Utils.ApiTypes.AdminInfo> {
        const filter = {
            adminName: adminName.toLowerCase()
        };

        const info: Utils.ApiTypes.AdminInfo = await this.queryFindOne(filter);

        return info;
    }

    //根据adminID获取管理员信息
    public async getAdminInfoByAdminID(adminID: number): Promise<Utils.ApiTypes.AdminInfo> {
        const filter = {
            adminID
        };

        const info: Utils.ApiTypes.AdminInfo = await this.queryFindOne(filter);

        return info;
    }

    //添加管理员 password 传过来的是 md5 后的
    public async createAdmin(
        adminName:  string, 
        password:   string
    ): Promise<number> {
        const adminInfo: Utils.ApiTypes.AdminInfo = await this.getAdminInfoByAdminName(adminName);
        if (adminInfo) {
            const error = new Error('管理员已存在');
            throw error;
        }

        const createDate:       number  = Common.DateUtils.now();
        const createDateObj:    Date    = new Date(createDate);

        const passwordEn: string = await Utils.PasswordUtils.encryptPassword(password);

        const doc: Utils.ApiTypes.AdminInfo = {
            adminID:            0,
            adminName:          adminName.toLowerCase(),
            password:           passwordEn,
            
            createDate,
            createDateObj,

            loginTimes:         0,
            lastLoginDate:      0,
            lastLoginDateObj:   new Date(0)
        };

        const adminID: number = await this.queryInsertOne(doc);
        return adminID;
    }

    //更新管理员的登录信息
    public async modifyAdminLoginInfo(
        adminID:        number, 
        loginTimes:     number, 
        lastLoginDate:  number
    ): Promise<void> {
        //增加登录次数,记录最后登录时间
        const filter = {
            adminID
        };

        const update = {
            $set: {
                loginTimes,
                lastLoginDate,
                lastLoginDateObj: new Date(lastLoginDate)
            }
        };

        await this.queryUpdate(filter, update);
    }

    // 修改管理员的基本信息
    public async modifyAdminBaseInfo(
        adminID:    number, 
        params:     Utils.ApiTypes.AdminEditableInfo
    ): Promise<void> {
        const adminInfo: Utils.ApiTypes.AdminInfo = await this.getAdminInfoByAdminID(adminID);
        if (!adminInfo) {
            const error = new Error('adminID 不存在');
            throw error;
        }

        if (params.adminName !== undefined) {
            const info: Utils.ApiTypes.AdminInfo = await this.getAdminInfoByAdminName(params.adminName);
            if (info) {
                if (info.adminID !== adminID) {
                    const error = new Error('adminName 已存在');
                    throw error;
                }
            }
        }

        const filter = {
            adminID
        };

        const update = {
            $set: params
        };

        await this.queryUpdate(filter, update);
    }

    // 修改管理员的密码
    public async modifyAdminPassword(
        adminID:        number, 
        oldPassword:    string, 
        newPassword:    string
    ): Promise<void> {
        const adminInfo: Utils.ApiTypes.AdminInfo = await this.getAdminInfoByAdminID(adminID);
        if (!adminInfo) {
            const error = new Error('adminID 不存在');
            throw error;
        }

        const bOk: boolean = await Utils.PasswordUtils.checkPassword(oldPassword, adminInfo.password);
        if (!bOk) {
            const error = new Error('旧密码错误');
            throw error;
        }

        const filter = {
            adminID
        };

        const passwordEn: string = await Utils.PasswordUtils.encryptPassword(newPassword);

        const update = {
            $set: {
                password: passwordEn
            }
        };

        await this.queryUpdate(filter, update);
    }
}

export default new AdminsDB();