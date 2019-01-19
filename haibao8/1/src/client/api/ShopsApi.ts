import * as ApiTypes    from './ApiTypes';
import { ApiHttp }      from './ApiHttp';

export class ShopsApi {
    // 获取我的所有店铺
    public static async getShopPageData(
        accessToken:    string,
        sort:           string,
        desc:           boolean,
        from:           number,
        count:          number
    ): Promise<ApiTypes.ShopInfoPageData> {
        const params = {
            accessToken,
            sort,
            desc,
            from,
            count
        };

        const path:     string = '/api/account/shops';
        const result:   ApiTypes.ShopInfoPageData = await ApiHttp.get(path, params);
        return result;
    }

    // 创建一个店铺
    public static async createShop(
        accessToken:    string,
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
        const params = {
            accessToken,
            shopCatID,
            shopName,
            shopDesc,
            phoneNumber,
            shopAddress,
            longitude,
            latitude,
            logoUrl,
            shopDetail,
            shopImages
        };

        const path:     string = '/api/account/shops';
        const shopID:   number = await ApiHttp.post(path, params);
        return shopID;
    }

    // 获取我的一个店铺的信息
    public static async getShopInfo(shopID: number): Promise<ApiTypes.ShopInfo> {
        const path: string = `/api/account/shops/${shopID}`;
        const params = {};
        const result: ApiTypes.ShopInfo = await ApiHttp.get(path, params);
        return result;
    }

    // 修改我的一个店铺
    public static async modifyShop(
        accessToken:    string,
        shopID:         number,
        params:         ApiTypes.ShopEditableInfo
    ): Promise<boolean> {
        const data = {
            accessToken,
            ...params
        };

        const path:     string  = `/api/account/shops/${shopID}`;
        const result:   boolean = await ApiHttp.put(path, data);
        return result;
    }

    // 删除我的一个店铺
    public static async deleteShop(
        accessToken:    string,
        shopID:         number
    ): Promise<boolean> {
        const data = {
            accessToken
        };

        const path:     string  = `/api/account/shops/${shopID}`;
        const result:   boolean = await ApiHttp.delete(path, data);
        return result;
    }
}