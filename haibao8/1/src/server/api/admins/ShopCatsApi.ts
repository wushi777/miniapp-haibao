import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import { UploadFile }   from '../upload';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class ShopCatsApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // shop分类操作
        app.get   ('/api/admin/shopcats',               this.queryShopCatPageData);
        app.post  ('/api/admin/shopcats',               this.createShopCat);
        app.put   ('/api/admin/shopcats/:shopCatID',    this.modifyShopCat);
        app.delete('/api/admin/shopcats/:shopCatID',    this.deleteShopCat);
    }
    
    private async queryShopCatPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const q:        string  = Common.SysUtils.safeString(req.query.q);
        const sort:     string  = Common.SysUtils.safeString(req.query.sort);
        const desc:     boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:     number  = Common.SysUtils.safeNumber(req.query.from);
        const count:    number  = Common.SysUtils.safeNumber(req.query.count);

        const result: Utils.ApiTypes.ShopCatPageData = await db.shopCats.queryShopCatPageData(
            q, sort, desc, from, count);

        res.sendData(result);
    }

    private async createShopCat(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const shopCatName:    string  = Common.SysUtils.safeString(req.body.shopCatName);
        const shopCatDesc:    string  = Common.SysUtils.safeString(req.body.shopCatDesc);
        const hotspot:          boolean = Common.SysUtils.safeBoolean(req.body.hotspot);
        const orderNum:         number  = Common.SysUtils.safeNumber(req.body.orderNum);

        const shopCatID: number = await db.shopCats.createShopCat(shopCatName, shopCatDesc, hotspot, orderNum);
        res.sendData(shopCatID);
    }

    private async modifyShopCat(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const shopCatID: number = Common.SysUtils.safeNumber(req.params.shopCatID);

        const params: Utils.ApiTypes.ShopCatEditableInfo = {};

        if (req.body.shopCatName !== undefined) {
            params.shopCatName = Common.SysUtils.safeString(req.body.shopCatName);
        }

        if (req.body.shopCatDesc !== undefined) {
            params.shopCatDesc = Common.SysUtils.safeString(req.body.shopCatDesc);
        }

        if (req.body.hotspot !== undefined) {
            params.hotspot = Common.SysUtils.safeBoolean(req.body.hotspot);
        }

        if (req.body.orderNum !== undefined) {
            params.orderNum = Common.SysUtils.safeNumber(req.body.orderNum);
        }

        await db.shopCats.modifyShopCat(shopCatID, params);
        res.sendSuccess();
    }

    private async deleteShopCat(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const shopCatID: number = Common.SysUtils.safeNumber(req.params.shopCatID);

        await db.shopCats.deleteShopCat(shopCatID);
        res.sendSuccess();
    }
}