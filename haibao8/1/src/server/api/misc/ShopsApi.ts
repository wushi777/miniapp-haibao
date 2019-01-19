import * as Common  from '../../common';
import * as Utils   from '../../utils';
import * as db      from '../../db';

import * as Base    from '../base';

export class ShopsApi extends Base.BaseApi {
    protected setupRouter(app: Base.ExpressApp): void {
        app.get('/api/misc/shops-homedata', this.queryShopHomeData);
        app.get('/api/misc/shops',          this.queryShopPageData);
        app.get('/api/misc/shops/:shopID',  this.getShopInfo);
        app.get('/api/misc/shopcats',       this.getShopCatList);
    }

    private async queryShopHomeData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const sort:     string  = Common.SysUtils.safeString(req.query.sort);
        const desc:     boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:     number  = Common.SysUtils.safeNumber(req.query.from);
        const count:    number  = Common.SysUtils.safeNumber(req.query.count);

        const reviewStatus: number = Utils.ApiTypes.ReviewStatusEnum.srsSuccess;

        const slidePageData: Utils.ApiTypes.ShopSlidePageData = await db.shopSlides.queryShopSlidePageData(
            '', Utils.ApiTypes.OrderNumFieldName, false, 0, 0);

        const shopPageData: Utils.ApiTypes.ShopInfoPageData = await db.shops.queryShopPageData(
            0, reviewStatus, 0, 0, '', sort, desc, from, count);

        const result: Utils.ApiTypes.ShopHomeData = {
            slides: slidePageData.data,
            shopPageData
        };

        res.sendData(result);
    }

    private async queryShopPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const startDate:    number  = Common.SysUtils.safeNumber(req.query.startDate);
        const endDate:      number  = Common.SysUtils.safeNumber(req.query.endDate);
        const q:            string  = Common.SysUtils.safeString(req.query.q);

        const sort:         string  = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number  = Common.SysUtils.safeNumber(req.query.from);
        const count:        number  = Common.SysUtils.safeNumber(req.query.count);

        const accountID:    number  = 0;
        const reviewStatus: number  = Utils.ApiTypes.ReviewStatusEnum.srsSuccess;

        const data: Utils.ApiTypes.ShopInfoPageData = await db.shops.queryShopPageData(
            accountID, reviewStatus, startDate, endDate, q, sort, desc, from, count);

        res.sendData(data);
    }

    private async getShopInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const shopID:           number  = Common.SysUtils.safeNumber(req.params.shopID);
        const updateViewTimes:  boolean = Common.SysUtils.safeBoolean(req.query.updateViewTimes);

        let info: Utils.ApiTypes.ShopInfo = await db.shops.getShopInfo(shopID, updateViewTimes);

        if (info && info.reviewStatus !== Utils.ApiTypes.ReviewStatusEnum.srsSuccess) {
            info = null;
        }

        res.sendData(info);
    }

    private async getShopCatList(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const shopCatPageData: Utils.ApiTypes.ShopCatPageData = await db.shopCats.queryShopCatPageData(
            '', 'orderNum', false, 0, 0);
        
        res.sendData(shopCatPageData.data);
    }
}
