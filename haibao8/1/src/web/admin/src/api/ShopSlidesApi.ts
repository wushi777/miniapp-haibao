import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

export class ShopSlidesApi extends BaseApi {
    public async queryShopSlidePageData(
        q:      string,
        sort:   string, 
        desc:   boolean, 
        from:   number, 
        count:  number
    ): Promise<ApiTypes.ShopSlidePageData> {
        const params = {
            q,
            sort,
            desc,
            from,
            count
        };

        const data: ApiTypes.ShopSlidePageData = await this.http.get('/api/admin/shopslides', params);
        return data;
    }

    public async createShopSlide(
        shopSlideName:  string, 
        shopSlideDesc:  string,
        shopSlideUrl:   string,
        shopSlideLink:  string,
        orderNum:       number
    ): Promise<number> {
        const params = {
            shopSlideName,
            shopSlideDesc,
            shopSlideUrl,
            shopSlideLink,
            orderNum
        };

        const shopSlideID: number = await this.http.post('/api/admin/shopslides', params);
        return shopSlideID;
    }

    public async modifyShopSlide(shopSlideID: number, params: ApiTypes.ShopSlideEditableInfo): Promise<boolean> {
        const result: boolean = await this.http.put(`/api/admin/shopslides/${shopSlideID}`, params);
        return result;
    }

    public async deleteShopSlide(shopSlideID: number): Promise<boolean> {
        const params = {};
        const result: boolean = await this.http.delete(`/api/admin/shopslides/${shopSlideID}`, params);
        return result;
    }
}