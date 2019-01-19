import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

// 用户帐号管理接口
export class AccountsApi extends BaseApi {
    // 获取帐号列表
    public async queryAccountPageData(
        q:      string, 
        sort:   string, 
        desc:   boolean, 
        from:   number, 
        count:  number
    ): Promise<ApiTypes.AccountInfoPageData> {
        const params = {
            q, 
            sort,
            desc,
            from,
            count
        };

        const data: ApiTypes.AccountInfoPageData = await this.http.get('/api/admin/accounts', params);
        return data;
    }

    // 获取一个帐号的基本信息
    public async getAccountBaseInfo(accountID: number): Promise<ApiTypes.AccountInfo> {
        const params = {};
        const accountInfo: ApiTypes.AccountInfo = await this.http.get(`/api/admin/accounts/${accountID}`, params);
        return accountInfo;
    }

    public async giveMoneyToAccount(accountID: number, orderMoneyFen: number): Promise<boolean> {
        const params = {
            orderMoneyFen
        };
        const data: boolean = await this.http.post(`/api/admin/givemoney/${accountID}`, params);
        return data;
    }
}