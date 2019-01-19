import * as api from '../../../api/index';
import * as wxapi from '../../../wxapi/index';
import * as common from '../../../common/index';
import * as utils from '../../../utils/index';
import { textChangeRangeIsUnchanged } from 'typescript';

interface MinesShopData {
	shopLogoUrl?: string;//店铺logo
	shopName?: string;//店铺名称

	shopVisitAllNum?: number;//访问总量
	shopVisitTotalNum?: number;//累计访客
	shopCollectTotal?: number;//收藏

	isExistShop?: boolean;//自己有没有店铺
	createShopCaption?: string;
}

interface MinesShopOptions {
}

class MinesShopPage extends common.BasePage {

	public data: MinesShopData = {
		shopLogoUrl: '/images/user-unlogin.png',
		shopName: '你还没有自己的店铺',

		shopVisitAllNum: 0,
		// shopVisitTotalNum: 5,
		// shopCollectTotal: 0,

		isExistShop: false,
		createShopCaption: '创建店铺'
	};

	protected setData(data: MinesShopData) {
		super.setData(data);
	}

	// 生命周期函数--监听页面加载
	public async onLoad(pageUI: common.PageUI, options: MinesShopOptions): Promise<void> {
		super.onLoad(pageUI, options);
	}

	public async onShow(): Promise<void> {
		this.requestMineShopData();
	}

	private async requestMineShopData(): Promise<void> {
		common.CommonFuncs.showBusy('请求中...');

		try {
			if (utils.systemLogin.serverLogined()) {
				const accessToken: string = utils.storage.accessToken;

				const mineShopData: api.ApiTypes.ShopInfoPageData = await api.ShopsApi.getShopPageData(
					accessToken, 'createDate', true, 0, 3);

				console.log('mineShopData:', mineShopData);

				this.data.isExistShop = (mineShopData.total > 0) ? true : false
				let createShopCaption: string = '';
				if (this.data.isExistShop) {
					createShopCaption = '编辑店铺';
					this.setData({
						shopLogoUrl: mineShopData.data[0].logoUrl,
						shopName: mineShopData.data[0].shopName,
						createShopCaption: createShopCaption,
						shopVisitAllNum: mineShopData.data[0].viewTimes,
					});	
				} else {
					createShopCaption = '创建店铺';
				}
			}

			common.CommonFuncs.hideToast();
		} catch (err) {
			common.CommonFuncs.showModel('请求失败', err);
			console.log('request fail', err);
		}
	};

	public onShopCreateOrEdit(event: Object) {
		if (utils.systemLogin.serverLogined()) {
			let url: string = '';
			if (this.data.isExistShop) {
				url = '/pages/shop/shopjoin/shopjoin?createOrEdit=edit';
			} else {
				url = '/pages/shop/shopjoin/shopjoin?createOrEdit=add';
			}

			wxapi.WxNavigate.navigateTo(url);
		} else {
			const url: string = '/pages/login/login';
			wxapi.WxNavigate.navigateTo(url);
		}
	}

	public onToShopDetail(event: Object) {
		if (this.data.isExistShop) {
			const url: string = '/pages/shop/shopdetail/shopdetail'
			wxapi.WxNavigate.navigateTo(url);
		} else {
			common.CommonFuncs.showModel('提示', '您还没有店铺，请先创建自己的店铺');
		}
	}
}

export default new MinesShopPage();