import * as api     from '../../api/index';
import * as wxapi   from '../../wxapi/index';
import * as common  from '../../common/index';
import * as utils   from '../../utils/index';


interface MineData {
    userInfo?: api.ApiTypes.WxUserInfo;
    logged?:   boolean;
}

class MinePage extends common.BasePage {
    public data: MineData = {
        userInfo: {
            nickName:   '昵称',
            avatarUrl:  '/images/user-unlogin.png',
            gender:     1,
            city:       '',
            province:   '',
            country:    '',
            language:   ''
        },
        logged: false
    }

    protected setData(data: MineData) {
        super.setData(data);
    }
    private updateUI() {
        if (utils.systemLogin.serverLogined()) {
            this.setData({
                userInfo: utils.storage.accountInfo.userInfo,
                logged: true,
            })
        }
    }

    public async onLoad(pageUI: common.PageUI, options: Object): Promise<void> {
        super.onLoad(pageUI, options);
    }

    public onShow() {
        this.updateUI();
    }
    public onUserRegister(event) {
        const url: string = '/pages/login/login';
        wxapi.WxNavigate.navigateTo(url);                
    }

    public async onToMineShop(detail: Object): Promise<void> {
        const url: string = './mineshop/mineshop';
        wxapi.WxNavigate.navigateTo(url);    
    }

    public async onMyQrCode(detail: Object): Promise<void> {
          //获取店铺 ID 的 WXACode
          const accessToken = utils.storage.accessToken;
          const wxacode = api.AccountApi.getWXACode(accessToken, 
                                          "shopID",
                                          "pages/shop/shopdetail/shopdetail", 
                                          300,
                                          true,
                                          0,
                                          0,
                                          0,
                                          false);
          console.log("2code",wxacode);
    }

    public async onToMineCollect(event: Object): Promise<void> {
        const url: string = './minecollect/minecollect';
        wxapi.WxNavigate.navigateTo(url);    
    }
}

export default new MinePage();