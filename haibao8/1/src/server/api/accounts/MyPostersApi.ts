import * as assert          from 'assert';

import * as Common          from '../../common';
import * as Utils           from '../../utils';
import * as db              from '../../db';

import * as Base            from '../base';
import { BaseAccountApi }   from './BaseAccountApi';

export class MyPostersApi extends BaseAccountApi {
    protected setupRouter(app: Base.ExpressApp): void {
        //我的海报
        app.post('/api/account/myposters',                  this.createMyPoster);
        app.get('/api/account/myposters',                   this.queryMyPosterPageData);
        app.get('/api/account/myposters/:myPosterID',       this.getMyPosterInfo);
        app.put('/api/account/myposters/:myPosterID',       this.modifyMyPoster);
        app.delete('/api/account/myposters/:myPosterID',    this.deleteMyPoster);
    }

    private async createMyPoster(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const myPosterName: string = Common.SysUtils.safeString(req.body.myPosterName);
        const myPosterDesc: string = Common.SysUtils.safeString(req.body.myPosterDesc);
        const myPosterUrl:  string = Common.SysUtils.safeString(req.body.myPosterUrl);
        const posterID:     number = Common.SysUtils.safeNumber(req.body.posterID);

        const myPosterID: number = await db.myPosters.createMyPoster(token.accountID,
            myPosterName, myPosterDesc, /*myPosterThumbUrl,*/ myPosterUrl, posterID);

        res.sendData(myPosterID);
    }

    private async deleteMyPoster(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const myPosterID: number = Common.SysUtils.safeNumber(req.params.myPosterID);

        await db.myPosters.deleteMyPoster(token.accountID, myPosterID);

        res.sendSuccess();
    }

    private async modifyMyPoster(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const myPosterID: number = Common.SysUtils.safeNumber(req.params.myPosterID);

        const params: Utils.ApiTypes.MyPosterEditableInfo = {};

        if (req.body.myPosterName !== undefined) {
            params.myPosterName = Common.SysUtils.safeString(req.body.myPosterName);
        }

        if (req.body.myPosterDesc !== undefined) {
            params.myPosterDesc = Common.SysUtils.safeString(req.body.myPosterDesc);
        }

        if (req.body.myPosterUrl !== undefined) {
            params.myPosterUrl = Common.SysUtils.safeString(req.body.myPosterUrl);
        }

        if (req.body.posterID !== undefined) {
            params.posterID = Common.SysUtils.safeNumber(req.body.posterID);
        }

        const myPosterInfo: Utils.ApiTypes.MyPosterInfo = await db.myPosters.getMyPosterInfo(token.accountID, myPosterID);
        if (!myPosterInfo || myPosterInfo.accountID !== token.accountID) {
            const error = new Error('myPosterID 非法');
            throw error;
        }

        await db.myPosters.modifyMyPoster(token.accountID, myPosterID, params);
        res.sendSuccess();
    }

    private async getMyPosterInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const myPosterID: number = Common.SysUtils.safeNumber(req.params.myPosterID);

        const info: Utils.ApiTypes.MyPosterInfo = await db.myPosters.getMyPosterInfo(token.accountID, myPosterID);

        res.sendData(info);
    }

    private async queryMyPosterPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const startDate:    number  = Common.SysUtils.safeNumber(req.query.startDate);
        const endDate:      number  = Common.SysUtils.safeNumber(req.query.endDate);
        const q:            string  = Common.SysUtils.safeString(req.query.q);
        const sort:         string  = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number  = Common.SysUtils.safeNumber(req.query.from);
        const count:        number  = Common.SysUtils.safeNumber(req.query.count);

        const data: Utils.ApiTypes.MyPosterInfoPageData = await db.myPosters.queryMyPosterPageData(
            token.accountID, startDate, endDate, q, sort, desc, from, count);

        res.sendData(data);
    }
}
