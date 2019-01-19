import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

export class ShopCatsApi extends BaseApi {
    public async queryShopCatPageData(
        q:      string,
        sort:   string, 
        desc:   boolean,
        from:   number, 
        count:  number
    ): Promise<ApiTypes.ShopCatPageData> {
        const params = {
            q,
            sort,
            desc,
            from,
            count            
        };

        const data: ApiTypes.ShopCatPageData = await this.http.get('/api/admin/shopcats', params);
        return data;
    }

    public async createShopCat(
        shopCatName:  string, 
        shopCatDesc:  string,
        hotspot:        boolean,
        orderNum:       number
    ): Promise<number> {
        const params = {
            shopCatName,
            shopCatDesc,
            hotspot,
            orderNum
        };

        const shopCatID: number = await this.http.post('/api/admin/shopcats', params);
        return shopCatID;
    }

    public async modifyShopCat(shopCatID: number, params: ApiTypes.ShopCatEditableInfo): Promise<boolean> {
        const result: boolean = await this.http.put(`/api/admin/shopcats/${shopCatID}`, params);
        return result;
    }

    public async deleteShopCat(shopCatID: number): Promise<boolean> {
        const params = {};
        const result: boolean = await this.http.delete(`/api/admin/shopcats/${shopCatID}`, params);
        return result;
    }
}