import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class ShopsApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // shops 操作
        app.get('/api/admin/shops',                 this.queryShopPageData);
        app.put('/api/admin/shops-review/:shopID',  this.reviewShop);
    }

    private async queryShopPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:    number      = Common.SysUtils.safeNumber(req.query.accountID);
        const startDate:    number      = Common.SysUtils.safeNumber(req.query.startDate);
        const endDate:      number      = Common.SysUtils.safeNumber(req.query.endDate);

        const reviewStatus: Utils.ApiTypes.ReviewStatusEnum = Common.SysUtils.safeNumber(req.query.reviewStatus);

        const q:            string      = Common.SysUtils.safeString(req.query.q);
        const sort:         string      = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean     = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number      = Common.SysUtils.safeNumber(req.query.from);
        const count:        number      = Common.SysUtils.safeNumber(req.query.count);

        const result: Utils.ApiTypes.ShopInfoPageData = await db.shops.queryShopPageData(
            accountID, reviewStatus, startDate, endDate, q, sort, desc, from, count);

        const accountsMap: Map<number, Utils.ApiTypes.AccountInfo> = new Map();

        for (const item of result.data) {
            let accountInfo: Utils.ApiTypes.AccountInfo = accountsMap.get(item.accountID);
            if (!accountInfo) {
                accountInfo = await db.accounts.getAccountInfoByAccountID(item.accountID);
                if (accountInfo) {
                    accountsMap.set(item.accountID, accountInfo);
                }
            }

            if (accountInfo) {
                item.accountNickName = accountInfo.userInfo.nickName;
            }
        }
        
        res.sendData(result);
    }

    private async reviewShop(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);
        
        const shopID:       number = Common.SysUtils.safeNumber(req.params.shopID);
        const reviewStatus: Utils.ApiTypes.ReviewStatusEnum = Common.SysUtils.safeNumber(req.body.reviewStatus);
        const rejectReason: string = Common.SysUtils.safeString(req.body.rejectReason);

        await db.shops.reviewShop(shopID, reviewStatus, rejectReason);
        res.sendSuccess();
    }
}