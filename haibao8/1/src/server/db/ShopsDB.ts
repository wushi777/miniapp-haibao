import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class ShopsDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.shopsTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.shopID;
    }

    // 分页查询店铺
    public async queryShopPageData(
        accountID:      number,

        reviewStatus:   number,
        startDate:      number,
        endDate:        number,
        
        q:              string,
        sort:           string, 
        desc:           boolean, 
        from:           number, 
        count:          number
    ): Promise<Utils.ApiTypes.ShopInfoPageData> {
        const filter: any = {};

        if (accountID) {
            filter.accountID = accountID;
        }

        if (reviewStatus) {
            filter.reviewStatus = reviewStatus;
        }

        if (startDate || endDate) {
            filter.createDate = {};
            if (startDate) {
                filter.createDate['$gte']   = startDate;
            }

            if (endDate) {
                filter.createDate['$lte']   = endDate;
            }
        }

        if (q) {
            const regExp = Common.StrUtils.makeMongoFindRegExp(q);

            filter.$or = [
                {shopName: regExp},
                {shopDesc: regExp}
            ];
        }

        const total:    number = await this.queryCount(filter);
        const data:     Utils.ApiTypes.ShopInfo[]  = await this.queryFindEx(filter, sort, desc, from, count);

        const result: Utils.ApiTypes.ShopInfoPageData = {
            total,
            data
        };

        return result;
    }

    // 获取店铺信息
    public async getShopInfo(
        shopID:             number,
        updateViewTimes:    boolean
    ): Promise<Utils.ApiTypes.ShopInfo> {
        const filter = {
            shopID
        };

        if (updateViewTimes) {
            const update = {
                $inc: {
                    viewTimes: 1
                }
            };

            await this.queryUpdate(filter, update);
        }

        const info: Utils.ApiTypes.ShopInfo = await this.queryFindOne(filter);
        return info;
    }

    // 创建店铺
    public async createShop(
        accountID:      number,
        shopCatID:      number,
        shopName:       string,
        shopDesc:       string,
        phoneNumber:    string,
        shopAddress:    string,
        longitude:      number,
        latitude:       number,
        logoUrl:        string,
        shopDetail:     string,
        shopImages:     string[]
    ): Promise<number> {
        const createDate:       number  = Common.DateUtils.now();
        const createDateObj:    Date    = new Date(createDate);

        const doc: Utils.ApiTypes.ShopInfo = {
            shopID:         0,
            accountID,

            shopCatID,
            shopName,
            shopDesc,
            phoneNumber,
            shopAddress,
            longitude,
            latitude,
            logoUrl,
            shopDetail,
            shopImages,
            
            viewTimes:      0,

            reviewStatus:   Utils.ApiTypes.ReviewStatusEnum.srsWait,
            rejectReason:   '',

            createDate,
            createDateObj,

            modifyDate:     0,
            modifyDateObj:  new Date(0),

            reviewDate:     0,
            reviewDateObj:  new Date(0),
        };

        const shopID: number = await this.queryInsertOne(doc);
        return shopID;
    }

    // 修改店铺
    public async modifyShop(
        shopID: number,
        params: Utils.ApiTypes.ShopEditableInfo
    ): Promise<void> {
        if (Common.SysUtils.isEmptyObject(params)) {
            return;
        }

        const filter = {
            shopID
        };

        const modifyDate:       number  = Common.DateUtils.now();
        const modifyDateObj:    Date    = new Date(modifyDate);

        const update = {
            $set: {
                ...params,

                modifyDate,
                modifyDateObj,

                reviewStatus:   Utils.ApiTypes.ReviewStatusEnum.srsWait,
                rejectReason:   ''
            }
        };

        await this.queryUpdate(filter, update);
    }

    // 删除店铺
    public async deleteShop(
        shopID: number
    ): Promise<void> {
        const filter = {
            shopID
        };

        await this.queryDelete(filter);
    }

    // 审核店铺
    public async reviewShop(
        shopID:         number,
        reviewStatus:   Utils.ApiTypes.ReviewStatusEnum,
        rejectReason:   string
    ): Promise<void> {
        const filter = {
            shopID
        };

        const reviewDate:       number  = Common.DateUtils.now();
        const reviewDateObj:    Date    = new Date(reviewDate);

        const update = {
            $set: {
                reviewStatus,
                rejectReason,

                reviewDate,
                reviewDateObj
            }
        };

        await this.queryUpdate(filter, update);
    }
}
export default new ShopsDB();