import * as wxapi   from './wxapi/index';
import * as api     from './api/index';
import * as common  from './common/index';
import * as utils   from './utils/index';

class Application {
    public async onLaunch(): Promise<void> {
        try {
            let bValid: boolean = false;

            const accessToken: string = utils.storage.accessToken;
            
            if (accessToken) {
                bValid = await wxapi.WxOpen.checkSession();
                if (bValid) {
                    bValid = await api.AccountApi.checkAccessToken(accessToken);
                }
            }

            if (!bValid) {
                utils.storage.accountInfo   = null;
                utils.storage.accessToken   = '';

                // 获取loginCode并保存到Storage里,供以后登录使用
                const loginCode: string = await wxapi.WxOpen.login();
                utils.storage.loginCode = loginCode;
            }
        } catch (err) {
            console.error(err);
        }
    }
}

export default new Application();