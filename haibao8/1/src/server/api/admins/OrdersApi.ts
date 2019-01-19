import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class OrdersApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        //获取订单列表
        app.get('/api/admin/orders', this.queryOrderPageData);
    }

    //GET：获取订单列表
    private async queryOrderPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const sort:         string  = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number  = Common.SysUtils.safeNumber(req.query.from);
        const count:        number  = Common.SysUtils.safeNumber(req.query.count);
        const accountID:    number  = Common.SysUtils.safeNumber(req.query.accountID);
        const startDate:    number  = Common.SysUtils.safeNumber(req.query.startDate);
        const endDate:      number  = Common.SysUtils.safeNumber(req.query.endDate);

        const result: Utils.ApiTypes.OrderInfoPageData = await db.orders.queryOrderPageData(
            accountID, sort, desc, from, count, startDate, endDate, true);

        res.sendData(result);
    }
}