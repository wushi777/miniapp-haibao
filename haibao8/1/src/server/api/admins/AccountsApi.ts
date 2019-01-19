import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class AccountsApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // 获取帐号列表
        app.get('/api/admin/accounts',              this.queryAccountPageData);

        // 获取一个帐号的基本信息
        app.get('/api/admin/accounts/:accountID',   this.getAccountBaseInfo);

        //为一个帐号赠送金钱
        app.post('/api/admin/givemoney/:accountID', this.giveMoneyToAccount);
    }

    // GET 获取帐号列表
    private async queryAccountPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const q:        string  = Common.SysUtils.safeString(req.query.q);     //查询关键字
        const sort:     string  = Common.SysUtils.safeString(req.query.sort);  //排序字段
        const desc:     boolean = Common.SysUtils.safeBoolean(req.query.desc); //是否倒序
        const from:     number  = Common.SysUtils.safeNumber(req.query.from);           
        const count:    number  = Common.SysUtils.safeNumber(req.query.count);

        const result: Utils.ApiTypes.AccountInfoPageData = await db.accounts.queryAccountPageData(
            q, sort, desc, from, count);

        // for (const item of result.data) {
        //     delete item.password
        // };

        res.sendData(result);
    }

    private async getAccountBaseInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID: number = Common.SysUtils.safeNumber(req.params.accountID);

        const accountInfo: Utils.ApiTypes.AccountInfo = await db.accounts.getAccountInfoByAccountID(accountID);
        
        if (!accountInfo) {
            const error = new Error('userID 不存在');
            throw error;
        }

        //delete accountInfo.password;

        res.sendData(accountInfo);
    }

    private async giveMoneyToAccount(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:        number  = Common.SysUtils.safeNumber(req.params.accountID);
        const orderMoneyFen:    number  = Common.SysUtils.safeNumber(req.body.orderMoneyFen);

        if (orderMoneyFen <= 0) {
            const error = new Error('orderMoneyFen 错误');
            throw error;
        }

        const accountInfo: Utils.ApiTypes.AccountInfo = await db.accounts.getAccountInfoByAccountID(accountID);
        if (!accountInfo) {
            const error = new Error('accountID 错误');
            throw error;
        }

        await db.orders.giveMoneyToAccount(accountID, orderMoneyFen);

        res.sendSuccess();
    }
}