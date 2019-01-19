import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class AccountsDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.accountsTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.accountID;
    }

    public async getAccountInfoByAccountID(accountID: number): Promise<Utils.ApiTypes.AccountInfo> {
        const filter = {
            accountID
        };

        const info: Utils.ApiTypes.AccountInfo = await this.queryFindOne(filter);

        return info;
    }

    public async getAccountInfoByOpenID(openid: string): Promise<Utils.ApiTypes.AccountInfo> {
        const filter = {
            openid
        };

        const info: Utils.ApiTypes.AccountInfo = await this.queryFindOne(filter);

        return info;
    }

    //添加用户
    public async createAccount(
        openid:         string,
        userInfo:       Utils.ApiTypes.WxUserInfo,
        avatarUrlCos:   string
    ): Promise<number> {
        const accountInfo: Utils.ApiTypes.AccountInfo = await this.getAccountInfoByOpenID(openid);
        if (accountInfo) {
            const error = new Error('帐号已存在');
            throw error;
        }

        const createDate:       number  = Common.DateUtils.now();
        const createDateObj:    Date    = new Date(createDate);
        
        const doc: Utils.ApiTypes.AccountInfo = {
            accountID:          0,

            openid,
            userInfo,

            phoneNumberInfo: {
                phoneNumber:        '',
                purePhoneNumber:    '',
                countryCode:        ''
            },

            avatarUrlCos,

            createDate,
            createDateObj,

            loginTimes:         0,

            lastLoginDate:      0,
            lastLoginDateObj:   new Date(0)
        };

        const accountID: number = await this.queryInsertOne(doc);
        return accountID;
    }

    //更新帐号的登录信息
    public async modifyAccountLoginInfo(
        accountID:      number, 
        loginTimes:     number, 
        lastLoginDate:  number
    ): Promise<void> {
        //增加登录次数,记录最后登录时间
        const filter = {
            accountID
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

    public async incAccountRemainMoneyFen(accountID: number, incByFen: number): Promise<void> {
        const filter = {
            accountID
        };

        const update = {
            $inc: {
                remainMoneyFen: incByFen
            }
        };

        await this.queryUpdate(filter, update);
    }

    // 修改一个用户的信息
    public async modifyAccountBaseInfo(
        accountID:  number, 
        params:     Utils.ApiTypes.AccountEditableInfo
    ): Promise<void> {
        const accountInfo: Utils.ApiTypes.AccountInfo = await this.getAccountInfoByAccountID(accountID);

        if (!accountInfo) {
            const error = new Error('帐号不存在');
            throw error;
        }

        const filter = {
            accountID
        };

        const update = {
            $set: params
        };

        await this.queryUpdate(filter, update);
    }

    // 查询帐号列表
    public async queryAccountPageData(
        q:      string, 
        sort:   string, 
        desc:   boolean, 
        from:   number, 
        count:  number
    ): Promise<Utils.ApiTypes.AccountInfoPageData> {
        const filter = this.makeQueryAccountFilter(q);

        const total: number = await this.queryCount(filter);
        const data:  Utils.ApiTypes.AccountInfo[] = await this.queryFindEx(filter, sort, desc, from, count);

        const result: Utils.ApiTypes.AccountInfoPageData = {
            total,
            data
        };

        return result;
    }

    private makeQueryAccountFilter(q: string): any {
        const filter: any = {};

        if (q) {
            const regExp: RegExp = Common.StrUtils.makeMongoFindRegExp(q);
            filter.$or = [
                { accountName: regExp },
                { companyName: regExp }
            ];
        }

        return filter;
    }
}

export default new AccountsDB();