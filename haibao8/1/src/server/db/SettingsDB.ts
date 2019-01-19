import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class SettingsDB extends BaseDB {
    //private rtcAccessToken: string;

    get tableName(): string {
        return DBConsts.tables.settingsTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.settingID;
    }

    private async loadSettingsFromDB(name: Utils.ApiTypes.SettingsNameEnum): Promise<any> {
        const filter = {
            name
        };

        const info: any = await this.queryFindOne(filter);

        if (info) {
            try {
                const result = Common.StrUtils.jsonParse(info.value);
                return result;
            } catch (err) {
                console.error(err);
            }
        }

        return null;
    }

    private async saveSettingsToDB(name: Utils.ApiTypes.SettingsNameEnum, value: any): Promise<void> {
        const filter = {
            name
        };

        const update = {
            value: Common.StrUtils.jsonStringify(value)
        }

        // const update = {
        //     $setOnInsert: {
        //         name
        //     },

        //     $set: {
        //         value: JSON.stringify(value)
        //     }
        // };

        await this.queryUpsertOne(filter, update);
    }

    public async getWxappConfigs(): Promise<Utils.ApiTypes.WxappConfigs> {
        const value: any = await this.loadSettingsFromDB(Utils.ApiTypes.SettingsNameEnum.wxappConfigs);

        const result: Utils.ApiTypes.WxappConfigs = {
            appid:      value ? Common.SysUtils.safeString(value.appid)        : 'wx65cc8df8f971f467',
            appsecret:  value ? Common.SysUtils.safeString(value.appsecret)    : '45aa3be71e5f90f9037e47f8afb5cccf'
        };

        return result;
    }

    public async setWxappConfigs(params: Utils.ApiTypes.WxappConfigs): Promise<void> {
        await this.saveSettingsToDB(Utils.ApiTypes.SettingsNameEnum.wxappConfigs, params);
    }

    public async getTencentCosConfigs(): Promise<Utils.ApiTypes.TencentCosConfigs> {
        const value: any = await this.loadSettingsFromDB(Utils.ApiTypes.SettingsNameEnum.tencentCosConfigs);
        const result: Utils.ApiTypes.TencentCosConfigs = {
            appid:      value ? Common.SysUtils.safeString(value.appid)        : '1257315987',
            secretid:   value ? Common.SysUtils.safeString(value.secretid)     : 'AKIDseEdqxxbCcrumSuERTdhbLwMcgkhI8ez',
            secretkey:  value ? Common.SysUtils.safeString(value.secretkey)    : 'Hbps7EE5kEWebP6f3FF3f8TdbMvJYbS6',
            bucket:     value ? Common.SysUtils.safeString(value.bucket)       : 'bj-1257315987',
            region:     value ? Common.SysUtils.safeString(value.region)       : 'ap-beijing'
        }
        return result;
    }

    public async setTencentCosConfigs(params: Utils.ApiTypes.TencentCosConfigs): Promise<void> {
        await this.saveSettingsToDB(Utils.ApiTypes.SettingsNameEnum.tencentCosConfigs, params);
    }

    public async getWxpayConfigs(): Promise<Utils.ApiTypes.WxpayConfigs> {
        const value: any = await this.loadSettingsFromDB(Utils.ApiTypes.SettingsNameEnum.wxpayConfigs);

        const result: Utils.ApiTypes.WxpayConfigs = {
            appid:  value ? Common.SysUtils.safeString(value.appid)    : '',
            mch_id: value ? Common.SysUtils.safeString(value.mch_id)   : '',
            key:    value ? Common.SysUtils.safeString(value.key)      : '',
            payee:  value ? Common.SysUtils.safeString(value.payee)    : ''
        };

        return result;
    }

    public async setWxpayConfigs(params: Utils.ApiTypes.WxpayConfigs): Promise<void> {
        await this.saveSettingsToDB(Utils.ApiTypes.SettingsNameEnum.wxpayConfigs, params);
    }

    public async getAlipayConfigs(): Promise<Utils.ApiTypes.AlipayConfigs> {
        const value: any = await this.loadSettingsFromDB(Utils.ApiTypes.SettingsNameEnum.alipayConfig);

        const result: Utils.ApiTypes.AlipayConfigs = {
            app_id:             value ? Common.SysUtils.safeString(value.app_id)               : '',
            app_private_key:    value ? Common.SysUtils.safeString(value.app_private_key)      : '',
            alipay_public_key:  value ? Common.SysUtils.safeString(value.alipay_public_key)    : '',
            sign_type:          value ? Common.SysUtils.safeString(value.sign_type)            : '',
            alipay_gateway:     value ? Common.SysUtils.safeString(value.alipay_gateway)       : ''
        };

        return result;
    }

    public async setAlipayConfigs(params: Utils.ApiTypes.AlipayConfigs): Promise<void> {
        const PublicKeyBegin:   string  = '-----BEGIN PUBLIC KEY-----';
        const PublicKeyEnd:     string  = '-----END PUBLIC KEY-----';
        const PrivateKeyBegin:  string  = '-----BEGIN RSA PRIVATE KEY-----';
        const PrivateKeyEnd:    string  = '-----END RSA PRIVATE KEY-----';

        let s: string = '';

        s = params.app_private_key;
        s.replace(/-----BEGIN RSA PRIVATE KEY-----/ig, '');
        s = s.replace(/-----END RSA PRIVATE KEY-----/ig, '');
        s = s.trim();
        s = `${PrivateKeyBegin}\n${s}\n${PrivateKeyEnd}`;
        params.app_private_key = s;

        s = params.alipay_public_key;
        s = s.replace(/-----BEGIN PUBLIC KEY-----/ig, '');
        s = s.replace(/-----END PUBLIC KEY-----/ig, '');
        s = s.trim();
        s = `${PublicKeyBegin}\n${s}\n${PublicKeyEnd}`;
        params.alipay_public_key = s;

        await this.saveSettingsToDB(Utils.ApiTypes.SettingsNameEnum.alipayConfig, params);
    }

    public async getDosageUnitPrice(): Promise<Utils.ApiTypes.DosageUnitPrice> {
        const value: any = await this.loadSettingsFromDB(Utils.ApiTypes.SettingsNameEnum.dosageUnitPrice);

        const result: Utils.ApiTypes.DosageUnitPrice = {
            fenPerRoomUser: value ? Common.SysUtils.safeNumber(value.fenPerRoomUser) : 1
        };

        return result;
    }

    public async setDosageUnitPrice(params: Utils.ApiTypes.DosageUnitPrice): Promise<void> {
        await this.saveSettingsToDB(Utils.ApiTypes.SettingsNameEnum.dosageUnitPrice, params);
    }

    public async getOrderSubject(): Promise<string> {
        const value:    any     = await this.loadSettingsFromDB(Utils.ApiTypes.SettingsNameEnum.orderSubject);
        const result:   string  = Common.SysUtils.safeString(value);
        return result;
    }

    public async setOrderSubject(orderSubject: string): Promise<void> {
        await this.saveSettingsToDB(Utils.ApiTypes.SettingsNameEnum.orderSubject, orderSubject);
    }

    public async getDefGiveMoneyFen(): Promise<number> {
        const value:    any     = await this.loadSettingsFromDB(Utils.ApiTypes.SettingsNameEnum.defGiveMoneyFen);
        const result:   number  = Common.SysUtils.safeNumber(value);
        return result;
    }

    public async setDefGiveMoneyFen(defGiveMoneyFen: number): Promise<void> {
        await this.saveSettingsToDB(Utils.ApiTypes.SettingsNameEnum.defGiveMoneyFen, defGiveMoneyFen);
    }
}

export default new SettingsDB();