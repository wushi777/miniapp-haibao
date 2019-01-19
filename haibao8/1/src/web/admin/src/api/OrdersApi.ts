import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

// 充值/订单处理接口
export class OrdersApi extends BaseApi {
    // 获取订单列表
    public async queryOrderPageData(
        accountID:  number, 
        from:       number, 
        count:      number, 
        sort:       string, 
        desc:       boolean, 
        startDate:  number, 
        endDate:    number
    ): Promise<ApiTypes.OrderInfoPageData> {
        const params = {
            accountID,
            from,
            count,
            sort,
            desc: Number(desc),
            startDate,
            endDate
        };

        const data: ApiTypes.OrderInfoPageData = await this.http.get('/api/admin/orders', params);
        return data;
    }
}