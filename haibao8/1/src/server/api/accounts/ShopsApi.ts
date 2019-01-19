import * as assert          from 'assert';
import * as Common          from '../../common';
import * as Utils           from '../../utils';
import * as db              from '../../db';

import * as Base            from '../base';
import { BaseAccountApi }   from './BaseAccountApi';

export class ShopsApi extends BaseAccountApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // 店铺操作
        app.post('/api/account/shops',              this.createShop);
        app.get('/api/account/shops',               this.queryShopPageData);
        app.get('/api/account/shops/:shopID',       this.getShopInfo);
        app.put('/api/account/shops/:shopID',       this.modifyShop);
        app.delete('/api/account/shops/:shopID',    this.deleteShop);
    }

    private async createShop(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const shopCatID:    number      = Common.SysUtils.safeNumber(req.body.shopCatID);
        const shopName:     string      = Common.SysUtils.safeString(req.body.shopName);
        const shopDesc:     string      = Common.SysUtils.safeString(req.body.shopDesc);
        const phoneNumber:  string      = Common.SysUtils.safeString(req.body.phoneNumber);
        const shopAddress:  string      = Common.SysUtils.safeString(req.body.shopAddress);
        const longitude:    number      = Common.SysUtils.safeNumber(req.body.longitude);
        const latitude:     number      = Common.SysUtils.safeNumber(req.body.latitude);
        const logoUrl:      string      = Common.SysUtils.safeString(req.body.logoUrl);
        const shopDetail:   string      = Common.SysUtils.safeString(req.body.shopDetail);
        const shopImages:   string[]    = req.body.shopImages;

        const shopID: number = await db.shops.createShop(token.accountID, shopCatID, shopName, shopDesc, 
            phoneNumber, shopAddress, longitude, latitude, logoUrl, shopDetail, shopImages);

        res.sendData(shopID);
    }

    public async getShopInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const shopID: number = Common.SysUtils.safeNumber(req.params.shopID);

        const shopInfo: Utils.ApiTypes.ShopInfo = await db.shops.getShopInfo(shopID, false);

        if (shopInfo.accountID !== token.accountID) {
            const error = new Error('shopID 非法');
            throw error;
        }

        res.sendData(shopInfo);
    }

    private async queryShopPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const startDate:    number  = Common.SysUtils.safeNumber(req.query.startDate);
        const endDate:      number  = Common.SysUtils.safeNumber(req.query.endDate);
        const q:            string  = Common.SysUtils.safeString(req.query.q);
        const sort:         string  = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number  = Common.SysUtils.safeNumber(req.query.from);
        const count:        number  = Common.SysUtils.safeNumber(req.query.count);

        const reviewStatus: Utils.ApiTypes.ReviewStatusEnum = Utils.ApiTypes.ReviewStatusEnum.srsAll; 
        
        const shopPageData: Utils.ApiTypes.ShopInfoPageData = await db.shops.queryShopPageData(
            token.accountID, reviewStatus, startDate, endDate, q, sort, desc, from, count);

        const shopCatsMap: Map<number, Utils.ApiTypes.ShopCatInfo> = new Map();
        for (const item of shopPageData.data) {
            const shopCatID: number = item.shopCatID;
            let shopCatInfo: Utils.ApiTypes.ShopCatInfo = shopCatsMap.get(shopCatID);
            if (!shopCatInfo) {
                shopCatInfo = await db.shopCats.getShopCatInfo(shopCatID);
                if (shopCatInfo) {
                    shopCatsMap.set(shopCatID, shopCatInfo);
                }
            }

            if (shopCatInfo) {
                item.shopCatName = shopCatInfo.shopCatName;
            }
        }

        res.sendData(shopPageData);
    }

    private async modifyShop(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const shopID: number = Common.SysUtils.safeNumber(req.params.shopID);

        const params: Utils.ApiTypes.ShopEditableInfo = {};

        if (req.body.shopCatID !== undefined) {
            params.shopCatID = Common.SysUtils.safeNumber(req.body.shopCatID);
        }

        if (req.body.shopName !== undefined) {
            params.shopName = Common.SysUtils.safeString(req.body.shopName);
        }

        if (req.body.shopDesc !== undefined) {
            params.shopDesc = Common.SysUtils.safeString(req.body.shopDesc);
        }

        if (req.body.phoneNumber !== undefined) {
            params.phoneNumber = Common.SysUtils.safeString(req.body.phoneNumber);
        }

        if (req.body.shopAddress !== undefined) {
            params.shopAddress = Common.SysUtils.safeString(req.body.shopAddress);
        }

        if (req.body.longitude !== undefined) {
            params.longitude = Common.SysUtils.safeNumber(req.body.longitude);
        }

        if (req.body.latitude !== undefined) {
            params.latitude = Common.SysUtils.safeNumber(req.body.latitude);
        }

        if (req.body.logoUrl !== undefined) {
            params.logoUrl = Common.SysUtils.safeString(req.body.logoUrl);
        }

        if (req.body.shopDetail !== undefined) {
            params.shopDetail = Common.SysUtils.safeString(req.body.shopDetail);
        }

        if (req.body.shopImages !== undefined) {
            params.shopImages = req.body.shopImages;
        }

        const shopInfo: Utils.ApiTypes.ShopInfo = await db.shops.getShopInfo(shopID, false);
        if (!shopInfo || shopInfo.accountID !== token.accountID) {
            const error = new Error('shopID 非法');
            throw error;
        }

        await db.shops.modifyShop(shopID, params);
        res.sendSuccess();
    }

    private async deleteShop(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const shopID: number = Common.SysUtils.safeNumber(req.params.shopID);

        const shopInfo: Utils.ApiTypes.ShopInfo = await db.shops.getShopInfo(shopID, false);
        if (!shopInfo || shopInfo.accountID !== token.accountID) {
            const error = new Error('shopID 非法');
            throw error;
        }

        await db.shops.deleteShop(shopID);
        res.sendSuccess();
    }
}
