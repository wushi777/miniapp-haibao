import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class PosterCatsApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // poster分类操作
        app.get   ('/api/admin/postercats',                 this.queryPosterCatPageData);
        app.post  ('/api/admin/postercats',                 this.createPosterCat);
        app.put   ('/api/admin/postercats/:posterCatID',    this.modifyPosterCat);
        app.delete('/api/admin/postercats/:posterCatID',    this.deletePosterCat);
    }

    private async queryPosterCatPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const q:        string  = Common.SysUtils.safeString(req.query.q);
        const sort:     string  = Common.SysUtils.safeString(req.query.sort);
        const desc:     boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:     number  = Common.SysUtils.safeNumber(req.query.from);
        const count:    number  = Common.SysUtils.safeNumber(req.query.count);

        const result: Utils.ApiTypes.PosterCatPageData = await db.posterCats.queryPosterCatPageData(
            q, sort, desc, from, count);

        res.sendData(result);
    }

    private async createPosterCat(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterCatName:    string  = Common.SysUtils.safeString(req.body.posterCatName);
        const posterCatDesc:    string  = Common.SysUtils.safeString(req.body.posterCatDesc);
        const hotspot:          boolean = Common.SysUtils.safeBoolean(req.body.hotspot);
        const orderNum:         number  = Common.SysUtils.safeNumber(req.body.orderNum);

        const posterCatID: number = await db.posterCats.createPosterCat(posterCatName, posterCatDesc, hotspot, orderNum);
        res.sendData(posterCatID);
    }

    private async modifyPosterCat(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterCatID: number = Common.SysUtils.safeNumber(req.params.posterCatID);

        const params: Utils.ApiTypes.PosterCatEditableInfo = {};

        if (req.body.posterCatName !== undefined) {
            params.posterCatName = Common.SysUtils.safeString(req.body.posterCatName);
        }

        if (req.body.posterCatDesc !== undefined) {
            params.posterCatDesc = Common.SysUtils.safeString(req.body.posterCatDesc);
        }

        if (req.body.hotspot !== undefined) {
            params.hotspot = Common.SysUtils.safeBoolean(req.body.hotspot);
        }

        if (req.body.orderNum !== undefined) {
            params.orderNum = Common.SysUtils.safeNumber(req.body.orderNum);
        }

        await db.posterCats.modifyPosterCat(posterCatID, params);
        res.sendSuccess();
    }

    private async deletePosterCat(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterCatID: number = Common.SysUtils.safeNumber(req.params.posterCatID);

        await db.posterCats.deletePosterCat(posterCatID);
        res.sendSuccess();
    }
}