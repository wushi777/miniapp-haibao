import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class ShopSlidesApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // shop轮播操作
        app.get   ('/api/admin/shopslides',                 this.queryShopSlidePageData);
        app.post  ('/api/admin/shopslides',                 this.createShopSlide);
        app.put   ('/api/admin/shopslides/:shopSlideID',    this.modifyShopSlide);
        app.delete('/api/admin/shopslides/:shopSlideID',    this.deleteShopSlide);
    }

    private async queryShopSlidePageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const q:        string  = Common.SysUtils.safeString(req.query.q);
        const sort:     string  = Common.SysUtils.safeString(req.query.sort);
        const desc:     boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:     number  = Common.SysUtils.safeNumber(req.query.from);
        const count:    number  = Common.SysUtils.safeNumber(req.query.count);

        const result: Utils.ApiTypes.ShopSlidePageData = await db.shopSlides.queryShopSlidePageData(
            q, sort, desc, from, count);
            
        res.sendData(result);
    }

    private async createShopSlide(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const shopSlideName:    string = Common.SysUtils.safeString(req.body.shopSlideName);
        const shopSlideDesc:    string = Common.SysUtils.safeString(req.body.shopSlideDesc);
        const shopSlideUrl:     string = Common.SysUtils.safeString(req.body.shopSlideUrl);
        const shopSlideLink:    string = Common.SysUtils.safeString(req.body.shopSlideLink);
        const orderNum:         number = Common.SysUtils.safeNumber(req.body.orderNum);

        const shopSlideID: number = await db.shopSlides.createShopSlide(
            shopSlideName, shopSlideDesc, shopSlideUrl, shopSlideLink, orderNum);

        res.sendData(shopSlideID);
    }

    private async modifyShopSlide(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const shopSlideID: number = Common.SysUtils.safeNumber(req.params.shopSlideID);

        const params: Utils.ApiTypes.ShopSlideEditableInfo = {};

        if (req.body.shopSlideName !== undefined) {
            params.shopSlideName = Common.SysUtils.safeString(req.body.shopSlideName);
        }

        if (req.body.shopSlideDesc !== undefined) {
            params.shopSlideDesc = Common.SysUtils.safeString(req.body.shopSlideDesc);
        }

        if (req.body.shopSlideUrl !== undefined) {
            params.shopSlideUrl = Common.SysUtils.safeString(req.body.shopSlideUrl);
        }

        if (req.body.shopSlideLink !== undefined) {
            params.shopSlideLink = Common.SysUtils.safeString(req.body.shopSlideLink);
        }

        if (req.body.orderNum !== undefined) {
            params.orderNum = Common.SysUtils.safeNumber(req.body.orderNum);
        }

        await db.shopSlides.modifyShopSlide(shopSlideID, params);
        res.sendSuccess();
    }

    private async deleteShopSlide(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const shopSlideID: number = Common.SysUtils.safeNumber(req.params.shopSlideID);

        await db.shopSlides.deleteShopSlide(shopSlideID);
        res.sendSuccess();
    }
}