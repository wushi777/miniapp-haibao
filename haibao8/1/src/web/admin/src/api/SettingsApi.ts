import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

// 管理员接口
export class SettingsApi extends BaseApi {
    // 获取数据库配置
    public async getDBSettings(): Promise<ApiTypes.DBInfo> {
        const params = {};
        const data: ApiTypes.DBInfo = await this.http.get('/api/admin/dbinfo', params);
        return data;
    }

    public async getWxpaySettings(): Promise<ApiTypes.WxpayConfigs> {
        const data: ApiTypes.WxpayConfigs = await this.getSettings(ApiTypes.SettingsNameEnum.wxpayConfigs);
        return data;
    }

    public async setWxpaySettings(params: ApiTypes.WxpayConfigs): Promise<boolean> {
        const result: boolean = await this.setSettings(ApiTypes.SettingsNameEnum.wxpayConfigs, params);
        return result;
    }

    public async getAlipaySettings(): Promise<ApiTypes.AlipayConfigs> {
        const data: ApiTypes.AlipayConfigs = await this.getSettings(ApiTypes.SettingsNameEnum.alipayConfig);
        return data;
    }

    public async setAlipaySettings(params: ApiTypes.AlipayConfigs): Promise<boolean> {
        const result: boolean = await this.setSettings(ApiTypes.SettingsNameEnum.alipayConfig, params);
        return result;
    }

    public async getPriceSettings(): Promise<ApiTypes.DosageUnitPrice> {
        const data: ApiTypes.DosageUnitPrice = await this.getSettings(ApiTypes.SettingsNameEnum.dosageUnitPrice);
        return data;
    }

    public async setPriceSettings(params: ApiTypes.DosageUnitPrice): Promise<boolean> {
        const result: boolean = await this.setSettings(ApiTypes.SettingsNameEnum.dosageUnitPrice, params);
        return result;
    }

    public async getDefGiveMoneySettings(): Promise<number> {
        const result: number = await this.getSettings(ApiTypes.SettingsNameEnum.defGiveMoneyFen);
        return result;
    }

    public async setDefGiveMoneySettings(defGiveMoneyFen: number): Promise<boolean> {
        const result: boolean = await this.setSettings(ApiTypes.SettingsNameEnum.defGiveMoneyFen, defGiveMoneyFen);
        return result;
    }

    // 获取商品名称
    public async getOrderSubject(): Promise<string> {
        const orderSubject: string = await this.getSettings(ApiTypes.SettingsNameEnum.orderSubject);
        return orderSubject;
    }

    // 设置商品名称
    public async setOrderSubject(orderSubject: string): Promise<boolean> {
        const result: boolean = await this.setSettings(ApiTypes.SettingsNameEnum.orderSubject, orderSubject);
        return result;
    }

    public async getWxappConfigs(): Promise<ApiTypes.WxappConfigs> {
        const result: ApiTypes.WxappConfigs = await this.getSettings(ApiTypes.SettingsNameEnum.wxappConfigs);
        return result;
    }

    public async setWxappConfigs(wxappConfigs: ApiTypes.WxappConfigs): Promise<boolean> {
        const result: boolean = await this.setSettings(ApiTypes.SettingsNameEnum.wxappConfigs, wxappConfigs);
        return result;
    }

    public async getTencentCosConfigs(): Promise<ApiTypes.TencentCosConfigs> {
        const result: ApiTypes.TencentCosConfigs = await this.getSettings(ApiTypes.SettingsNameEnum.tencentCosConfigs);
        return result;
    }

    public async setTencentCosConfigs(tencentCosConfigs: ApiTypes.TencentCosConfigs): Promise<boolean> {
        const result: boolean = await this.setSettings(ApiTypes.SettingsNameEnum.tencentCosConfigs, tencentCosConfigs);
        return result;
    }

    private async getSettings(settingName: string): Promise<any> {
        const params = {};
        const path: string = `/api/admin/settings/${settingName}`;

        const result: any = await this.http.get(path, params);
        return result;
    }

    private async setSettings(settingName: string, value: any): Promise<boolean> {
        const path: string = `/api/admin/settings/${settingName}`;
        const result: boolean = await this.http.put(path, value);
        return result;
    }
}