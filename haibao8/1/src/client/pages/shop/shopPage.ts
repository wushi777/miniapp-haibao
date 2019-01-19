import * as wxapi   from '../../wxapi/index';
import * as api     from '../../api/index';
import * as common  from '../../common/index';
import * as utils   from '../../utils/index';

interface ShopData {
	swiperImgList?: 	api.ApiTypes.ShopSlideInfo[];
	shopTagList?:		any[];
	shopCatsList?:		any[];

	indicatorDots?:		boolean;
	autoplay?:			boolean;
	interval?:			number;
	duration?:			number;
}

interface ShopOptions {

}

class ShopPage extends common.BasePage {
	public data: ShopData = {
		swiperImgList:  [],
		shopTagList:	[],
		shopCatsList:	[],
		indicatorDots:	true,
		autoplay:		false,
		interval:		3000,
		duration:		1000
	};

	protected setData(data: ShopData) {
        super.setData(data);
    }

    public async onLoad(pageUI: common.PageUI, options: ShopOptions): Promise<void> {
		super.onLoad(pageUI, options);
		await this.requestIndexData();
	}

    private async requestIndexData(): Promise<void> {
        common.CommonFuncs.showBusy('请求中...');

        try {
            const shopHomeData: api.ApiTypes.ShopHomeData = await api.MiscApi.getShopHomeData(
              'createDate', true, 0, 5);

            console.log('shopHomeData:', shopHomeData);

            // const result: any = {};
            // console.log('request success', result);
            this.setData({
                swiperImgList: shopHomeData.slides,
                // shopTagList: shopHomeData,
                shopCatsList: shopHomeData.shopPageData.data,
            });

            common.CommonFuncs.hideToast();
        } catch (err) {
            common.CommonFuncs.showModel('请求失败', err);
              console.log('request fail', err);
        }

        // var that = this;
        // var options = {
        //   requestUrl: config.service.requestIndexUrl,
        //   success(response) {
        //     console.log('request success', response)
        //     that.setData({
        //       swiperImgList: response.data.result.swiperImgList,
        //       shopClassList: response.data.result.shopClassList,
        //       shopItemList: response.data.result.shopItemList,
        //     });
        //     util.hideToast();
        //   },

        //   fail(error) {
        //     util.showModel('请求失败', error);
        //     console.log('request fail', error);
        //   }
        // };
        // qcloud.requestData(options);
	};
	
    public async onDetail(event): Promise<void> {
        console.log(event);
        const id:       number = event.currentTarget.dataset.id;
        const shopName: string = event.currentTarget.dataset.shopname;

        const url: string = `shopdetail/shopdetail?id=${id}&shopname=${shopName}`;
        wxapi.WxNavigate.navigateTo(url);
    }
    
    public async onShopJoin(event): Promise<void> {
        if (utils.systemLogin.serverLogined()) {
            const url: string = 'shopjoin/shopjoin';
            wxapi.WxNavigate.navigateTo(url);    
        } else {
            const url: string = '/pages/login/login';
            wxapi.WxNavigate.redirectTo(url);                
        }
    }
}

export default new ShopPage();