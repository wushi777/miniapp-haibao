import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

export class ShopsApi extends BaseApi {
    public async queryShopPageData(
        startDate:  	number, 
        endDate:    	number,

        q:              string,
        sort:       	string, 
        desc:       	boolean,
        from:       	number, 
        count:      	number
    ): Promise<ApiTypes.ShopInfoPageData> {
        const params = {
            startDate,
            endDate,

            q,
            sort,
            desc,
            from,
            count            
        };

        const data: ApiTypes.ShopInfoPageData = await this.http.get('/api/admin/shops', params);
        return data;
    }

    public async reviewShop(
        shopID: number,
        reviewStatus: ApiTypes.ReviewStatusEnum,
        rejectReason: string
    ): Promise<boolean> {
        const params = {
            reviewStatus,
            rejectReason
        };

        const path = `/api/admin/shops-review/${shopID}`;
        const result: boolean = await this.http.put(path, params);
        return result;
    }
}