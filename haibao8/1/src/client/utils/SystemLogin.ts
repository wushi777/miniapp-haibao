import * as wxapi   from '../wxapi/index';
import * as api     from '../api/index';
import * as common  from '../common/index';
import * as utils   from '../utils/index';

export interface GetUserInfoDetail {
    errMsg:         string;
    rawData:        string;
    signature:      string;
    encryptedData:  string;
    iv:             string;
}

export interface GetPhoneNumberDetail {
    errMsg:         string;
    encryptedData:  string;
    iv:             string;
}

export class SystemLogin {
    public async serverLogin(detail: GetUserInfoDetail): Promise<boolean> {
        const loginCode: string = utils.storage.loginCode;

        const loginInfo: api.ApiTypes.AccountLoginInfo = await api.AccountApi.login(
            loginCode,
            detail.rawData,
            detail.signature,        
            detail.encryptedData,
            detail.iv
        );

        utils.storage.accountInfo   = loginInfo.accountInfo;
        utils.storage.accessToken   = loginInfo.accessToken;
        utils.storage.loginCode     = '';

        return true;
    }


	public serverLogined(): boolean {

        const accessToken: string = utils.storage.accessToken;
        
        return !!accessToken;
	}
}

export const systemLogin = new SystemLogin();