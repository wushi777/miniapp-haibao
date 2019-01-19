import * as wxapi   from '../../../../wxapi/index';
import * as api     from '../../../../api/index';
import * as common  from '../../../../common/index';
import * as utils   from '../../../../utils/index';

interface ShopCatData {
    shopCatList?: api.ApiTypes.ShopCatInfo[];
}

class ShopCatPage extends common.BasePage {
    public data: ShopCatData = {
        shopCatList: [],
    }

    protected setData(data: ShopCatData): void {
        super.setData(data);
    }

	private async requestShopCatData(): Promise<void> {
		common.CommonFuncs.showBusy('请求中...');

		try {
            const shopCatList: api.ApiTypes.ShopCatInfo[] = await api.MiscApi.getShopCatList();
            this.setData({
                shopCatList,
            })
            console.log(shopCatList);
			common.CommonFuncs.hideToast();
		} catch (err) {
			common.CommonFuncs.showModel('请求失败', err);
			console.log('request fail', err);
		}
	};

    public async onLoad(pageUI: common.PageUI, options: ShopCatData): Promise<void> {
        super.onLoad(pageUI, options);
        this.requestShopCatData();
    }

    public onItemClick(event) {
        console.log(event);
        wxapi.WxStorage.setSync('shopCatID', event.currentTarget.dataset.shopcatid);
        wxapi.WxStorage.setSync('shopCatName',event.currentTarget.dataset.shopcatname)
        wxapi.WxNavigate.navigateBack(1);
    }
}

export default new ShopCatPage();