import * as assert          from 'assert';

import * as Common          from '../../common';
import * as Utils           from '../../utils';
import * as db              from '../../db';

import * as Base            from '../base';
import { BaseAccountApi }   from './BaseAccountApi';

export class DosagesApi extends BaseAccountApi {
    protected setupRouter(app: Base.ExpressApp): void {
        //获取消费记录列表
        app.get('/api/account/dosages', this.queryDosagePageData);
    }

    //GET 获取消费记录列表
    private async queryDosagePageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:    number  = token.accountID;

        const startDate:    number  = Common.SysUtils.safeNumber(req.query.startDate);
        const endDate:      number  = Common.SysUtils.safeNumber(req.query.endDate);
        const sort:         string  = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number  = Common.SysUtils.safeNumber(req.query.from);
        const count:        number  = Common.SysUtils.safeNumber(req.query.count);

        const result: Utils.ApiTypes.DosageInfoPageData = await db.dosages.queryDosagePageData(
            accountID, startDate, endDate, sort, desc, from, count);

        res.sendData(result);
    }
}
