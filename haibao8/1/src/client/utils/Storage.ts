import * as wxapi 	from '../wxapi/index';
import * as api 	from '../api/index';

const accountInfoKey	= 'accountInfo';
const accessTokenKey	= 'accessToken'
const loginCodeKey		= 'loginCode';

class Storage {
	// 获取帐号信息
	public get accountInfo(): api.ApiTypes.AccountInfo {
		return wxapi.WxStorage.getSync(accountInfoKey);
	}

	// 设置帐号信息
	public set accountInfo(value: api.ApiTypes.AccountInfo) {
		wxapi.WxStorage.setSync(accountInfoKey, value);
	}

	// 获取accessToken
	public get accessToken(): string {
		return wxapi.WxStorage.getSync(accessTokenKey);
	}

	// 设置 accessToken
	public set accessToken(value: string) {
		wxapi.WxStorage.setSync(accessTokenKey, value);
	}

	// 判断是否已登录
	public get logined(): boolean {
		const loggined: boolean = !!this.accessToken;
		return loggined;
	}

	// 获取 loginCode
	public get loginCode(): string {
		return wxapi.WxStorage.getSync(loginCodeKey);
	}

	// 设置 loginCode
	public set loginCode(value: string) {
		wxapi.WxStorage.setSync(loginCodeKey, value);
	}
}

export const storage = new Storage();