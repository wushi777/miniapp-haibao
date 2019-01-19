import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class ShopSlidesDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.shopSlidesTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.shopSlideID;
    }

    public async queryShopSlidePageData(
        q:      string,
        sort:   string,
        desc:   boolean,
        from:   number,
        count:  number
    ): Promise<Utils.ApiTypes.ShopSlidePageData> {
        const filter: any = {};

        if (q) {
            const regExp = Common.StrUtils.makeMongoFindRegExp(q);

            filter.$or = [
                {shopSlideName: regExp},
                {shopSlideDesc: regExp}
            ];
        }

        const total: number = await this.queryCount(filter);
        const data: Utils.ApiTypes.ShopSlideInfo[] = await this.queryFindEx(filter, sort, desc, from, count);

        const result: Utils.ApiTypes.ShopSlidePageData = {
            total,
            data
        };

        return result;
    }

    public async createShopSlide(
        shopSlideName:  string,
        shopSlideDesc:  string,
        shopSlideUrl:   string,
        shopSlideLink:  string,
        orderNum:       number
    ): Promise<any> {
        const doc: Utils.ApiTypes.ShopSlideInfo = {
            shopSlideID:       0,
            shopSlideName,
            shopSlideDesc,
            shopSlideUrl,
            shopSlideLink,
            orderNum
        };

        const shopSlideID: number = await this.queryInsertOne(doc);
        return shopSlideID;
    }

    public async modifyShopSlide(
        shopSlideID:    number,
        params:         Utils.ApiTypes.ShopSlideEditableInfo
    ): Promise<void> {
        if (Common.SysUtils.isEmptyObject(params)) {
            return;
        }

        const filter = {
            shopSlideID
        };

        const update = {
            $set: params
        };

        await this.queryUpdate(filter, update);
    }

    public async deleteShopSlide(
        shopSlideID: number
    ): Promise<void> {
        const filter = {
            shopSlideID
        };

        await this.queryDelete(filter);
    }
}
export default new ShopSlidesDB();