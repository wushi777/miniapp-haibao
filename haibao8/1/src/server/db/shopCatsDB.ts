import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class ShopCatsDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.shopCatsTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.shopCatID;
    }

    public async queryShopCatPageData(
        q:      string,
        sort:   string,
        desc:   boolean,
        from:   number,
        count:  number
    ): Promise<Utils.ApiTypes.ShopCatPageData> {
        const filter: any = {};

        if (q) {
            const regExp = Common.StrUtils.makeMongoFindRegExp(q);

            filter.$or = [
                {shopCatName: regExp},
                {shopCatDesc: regExp}
            ];
        }

        const total: number = await this.queryCount(filter);
        const data: Utils.ApiTypes.ShopCatInfo[] = await this.queryFindEx(filter, sort, desc, from, count);

        const result: Utils.ApiTypes.ShopCatPageData = {
            total,
            data
        };
        
        return result;
    }

    public async getShopCatInfo(shopCatID: number): Promise<Utils.ApiTypes.ShopCatInfo> {
        const filter = {
            shopCatID
        };

        const info: Utils.ApiTypes.ShopCatInfo = await this.queryFindOne(filter);
        return info;
    }

    public async getShopCatByName(shopCatName: string): Promise<Utils.ApiTypes.ShopCatInfo> {
        const filter = {
            shopCatName
        };

        const info: Utils.ApiTypes.ShopCatInfo = await this.queryFindOne(filter);
        return info;
    }

    public async createShopCat(
        shopCatName:  string,
        shopCatDesc:  string,
        hotspot:        boolean,
        orderNum:       number
    ): Promise<number> {
        const info: Utils.ApiTypes.ShopCatInfo = await this.getShopCatByName(shopCatName);
        if (info) {
            const error = new Error('分类名称已存在, 创建失败');
            throw error;
        }

        const doc: Utils.ApiTypes.ShopCatInfo = {
            shopCatID:       0,
            shopCatName,
            shopCatDesc,
            hotspot,
            orderNum
        };

        const shopCatID: number = await this.queryInsertOne(doc);
        return shopCatID;
    }

    public async modifyShopCat(
        shopCatID:    number,
        params:         Utils.ApiTypes.ShopCatEditableInfo
    ): Promise<void> {
        if (Common.SysUtils.isEmptyObject(params)) {
            return;
        }

        if (params.shopCatName !== undefined) {
            const info: Utils.ApiTypes.ShopCatInfo = await this.getShopCatByName(params.shopCatName);
            if (info && (info.shopCatID !== shopCatID)) {
                const error = new Error('分类名称已存在, 创建失败');
                throw error;
            }
        }

        const filter = {
            shopCatID
        };

        const update = {
            $set: params
        };

        await this.queryUpdate(filter, update);
    }

    public async deleteShopCat(
        shopCatID: number
    ): Promise<void> {
        const filter = {
            shopCatID
        };

        await this.queryDelete(filter);
    }
}
export default new ShopCatsDB();