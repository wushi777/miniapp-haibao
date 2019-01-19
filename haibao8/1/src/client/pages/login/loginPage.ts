import * as api from '../../api/index';
import * as wxapi from '../../wxapi/index';
import * as common from '../../common/index';
import * as utils from '../../utils/index';

// interface LoginOptions {
// }

interface LoginData {
    isTabBar?: string;
    loginAfterPage?: string;

    style?: string;
}

class LoginPage extends common.BasePage {
    public data: LoginData = {
        isTabBar: 'false',
        loginAfterPage: '',

        style: '',
    };

    protected setData(data: LoginData) {
        super.setData(data);
    }

    public async onLoad(pageUI: common.PageUI, options: LoginData): Promise<void> {
        super.onLoad(pageUI, options);
        console.log(options);
        this.data.isTabBar = options.isTabBar;
        this.data.loginAfterPage = options.loginAfterPage;
        this.toGetUserInfoPage();
    }

    public async onGetUserInfo(detail: utils.GetUserInfoDetail): Promise<void> {

        console.log(detail);

        if (detail.errMsg !== 'getUserInfo:ok') {
            common.CommonFuncs.showFail('获取权限失败');
            return;
        }

        common.CommonFuncs.showBusy('正在登录');
        try {
            await utils.systemLogin.serverLogin(detail);
            common.CommonFuncs.showSuccess('登录成功');

            //生成自己的小程序码?

            wxapi.WxNavigate.navigateBack(1);

            // if (this.data.isTabBar == 'true') {
            //     //wxapi.WxNavigate.switchTab(this.data.loginAfterPage);
            //     wxapi.WxNavigate.navigateBack(1);
            // } else {
            //     wxapi.WxNavigate.navigateBack(1);
            // }

        } catch (err) {
            common.CommonFuncs.showModel('登录错误', err.message);
        }

    }

    public async onGetPhoneNumber(detail: utils.GetUserInfoDetail): Promise<void> {

        console.log(detail);

        // if (detail.errMsg !== 'getUserInfo:ok') {
        //     common.CommonFuncs.showFail('获取权限失败');
        //     return;
        // }
        this.toGetUserInfoPage();
    }

    private toGetUserInfoPage() {
        this.setData({
            style: 'transform: rotateY(180deg);'
        })
    }
    private GetPhoneNumber() {
        this.setData({
            style: ''
        })
    }

}

export default new LoginPage();