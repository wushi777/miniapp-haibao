import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

// 消费记录接口
export class DosagesApi extends BaseApi {
    // 获取消费记录列表
    public async queryDosagePageData(
        accountID:  number, 
        startDate:  number, 
        endDate:    number, 
        from:       number, 
        count:      number, 
        sort:       string, 
        desc:       boolean
    ): Promise<ApiTypes.DosageInfoPageData> {
        const params = {
            accountID,
            startDate,
            endDate,
            from,
            count,
            sort,
            desc: Number(desc)
        };

        const data: ApiTypes.DosageInfoPageData = await this.http.get('/api/admin/dosages', params);
        return data;
    }
}