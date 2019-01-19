import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class SettingsApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // 获取数据库连接配置信息(仅用于安装)
        app.get('/api/admin/settings/dbinfo',           this.getDBInfo);

        //设置
        app.get('/api/admin/settings/:settingsName',    this.getSettings);
        app.put('/api/admin/settings/:settingsName',    this.setSettings);
    }

    // GET 获取数据库配置信息, 仅用于安装
    private async getDBInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const fileName: string = await Utils.configs.serverUrl;
        const text:     string = await Common.FileUtils.readFileUTF8(fileName);

        const dbInfo = Common.StrUtils.jsonParse(text);
        res.sendData(dbInfo);
    }

    private async getSettings(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const settingsName: Utils.ApiTypes.SettingsNameEnum = req.params.settingsName;
        
        let data: any;
        switch (settingsName) {
            case Utils.ApiTypes.SettingsNameEnum.alipayConfig:
                data = await db.settings.getAlipayConfigs();
                break;

            case Utils.ApiTypes.SettingsNameEnum.defGiveMoneyFen:
                data = await db.settings.getDefGiveMoneyFen();
                break;

            case Utils.ApiTypes.SettingsNameEnum.dosageUnitPrice:
                data = await db.settings.getDosageUnitPrice();
                break;

            case Utils.ApiTypes.SettingsNameEnum.tencentCosConfigs:
                data = await db.settings.getTencentCosConfigs();
                break;

            case Utils.ApiTypes.SettingsNameEnum.wxappConfigs:
                data = await db.settings.getWxappConfigs();
                break;

            case Utils.ApiTypes.SettingsNameEnum.wxpayConfigs:
                data = await db.settings.getWxpayConfigs();
                break;
                
            default:
                data = null;
        }

        res.sendData(data);
    }

    private async setSettings(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const settingsName: Utils.ApiTypes.SettingsNameEnum = req.params.settingsName;
        const params:       any = req.body;
        
        switch (settingsName) {
            case Utils.ApiTypes.SettingsNameEnum.alipayConfig:
                await db.settings.setAlipayConfigs(<Utils.ApiTypes.AlipayConfigs>params);
                break;

            case Utils.ApiTypes.SettingsNameEnum.defGiveMoneyFen:
                await db.settings.setDefGiveMoneyFen(Common.SysUtils.safeNumber(params.defGiveMoneyFen));
                break;

            case Utils.ApiTypes.SettingsNameEnum.dosageUnitPrice:
                await db.settings.setDosageUnitPrice(<Utils.ApiTypes.DosageUnitPrice>params);
                break;

            case Utils.ApiTypes.SettingsNameEnum.tencentCosConfigs:
                await db.settings.setTencentCosConfigs(<Utils.ApiTypes.TencentCosConfigs>params);
                break;

            case Utils.ApiTypes.SettingsNameEnum.wxappConfigs:
                await db.settings.setWxappConfigs(<Utils.ApiTypes.WxappConfigs>params);
                break;

            case Utils.ApiTypes.SettingsNameEnum.wxpayConfigs:
                await db.settings.setWxpayConfigs(<Utils.ApiTypes.WxpayConfigs>params);
                break;

            default:
                
        }

        res.sendSuccess();
    }
}