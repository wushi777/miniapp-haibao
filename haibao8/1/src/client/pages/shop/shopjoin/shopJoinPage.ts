import * as wxapi from '../../../wxapi/index';
import * as api from '../../../api/index';
import * as common from '../../../common/index';
import * as utils from '../../../utils/index';

interface ShopJoinData {
    shopID?: number;

    logoUrl?: string;
    shopName?: string;
    shopAddress?: string;
    shopLatitude?: number; // 纬度
    shopLongitude?: number; // 经度
    shopDesc?: string;

    phoneNumber?: string;
    shopImages?: string[],

    shopCatID?: number;
    shopCatName?: string;

    isExistShop?: boolean;//自己有没有店铺
    shopSubmitCaption?: string;
    createOrEdit?: string;
}

class ShopJoinPage extends common.BasePage {
    public data: ShopJoinData = {
        shopID: null,

        logoUrl: '',
        shopName: '',
        shopAddress: '',
        shopLatitude: 0,
        shopLongitude: 0,
        shopDesc: '',

        phoneNumber: '',
        shopImages: [],

        shopCatID: -1,
        shopCatName: '',

        isExistShop: false,
        shopSubmitCaption: '提交',
        createOrEdit: 'add',
    }

    protected setData(data: ShopJoinData): void {
        super.setData(data);
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
                let shopSubmitCaption: string = '';
                if (this.data.createOrEdit == 'add') {
                    shopSubmitCaption = '提交';
                    this.setData({
                        shopSubmitCaption: shopSubmitCaption,
                    })
                } else {
                    shopSubmitCaption = '重新提交';
                    this.data.shopID = mineShopData.data[0].shopID;
                    this.data.logoUrl = mineShopData.data[0].logoUrl;
                    this.data.shopImages = mineShopData.data[0].shopImages;
                    this.data.shopCatID = mineShopData.data[0].shopCatID;
                    this.data.shopCatName = mineShopData.data[0].shopCatName;
                    this.data.shopLatitude = mineShopData.data[0].longitude;
                    this.data.shopLongitude = mineShopData.data[0].longitude;
                    this.setData({
                        shopID: mineShopData.data[0].shopID,

                        logoUrl: mineShopData.data[0].logoUrl,
                        shopName: mineShopData.data[0].shopName,
                        shopAddress: mineShopData.data[0].shopAddress,
                        shopDesc: mineShopData.data[0].shopDesc,

                        phoneNumber: mineShopData.data[0].phoneNumber,
                        shopImages: mineShopData.data[0].shopImages,

                        shopCatID: mineShopData.data[0].shopCatID,
                        shopCatName: mineShopData.data[0].shopCatName,

                        shopSubmitCaption: shopSubmitCaption,
                    });
                }

            }
            common.CommonFuncs.hideToast();
        } catch (err) {
            common.CommonFuncs.showModel('请求失败', err);
            console.log('request fail', err);
        }
    };

    public async onLoad(pageUI: common.PageUI, options: ShopJoinData): Promise<void> {
        super.onLoad(pageUI, options);
        this.data.createOrEdit = options.createOrEdit;
        wxapi.WxStorage.setSync('shopCatID', '-1');
        wxapi.WxStorage.setSync('shopCatName', '');
        
        this.requestMineShopData();
    }

    public async onSubmit(event): Promise<void> {
        console.log(event);

        const accessToken: string = utils.storage.accessToken;

        if (this.data.isExistShop) {//编辑店铺
            const shopID = this.data.shopID;
            const shopEditableInfo: api.ApiTypes.ShopEditableInfo = {

                logoUrl: this.data.logoUrl,
                shopName: event.detail.value.shopname,
                shopAddress: event.detail.value.shopaddress,
                latitude: this.data.shopLatitude,
                longitude: this.data.shopLongitude,
                shopDesc: event.detail.value.shopdesc,

                phoneNumber: event.detail.value.shopPhoneNumber,
                shopImages: this.data.shopImages,

                shopCatID: this.data.shopCatID,
            };
            const bResult: boolean = await api.ShopsApi.modifyShop(accessToken, shopID, shopEditableInfo);
            console.log('bResult', bResult);
        } else {//添加店铺

            const logoUrl: string = this.data.logoUrl;
            const shopName: string = event.detail.value.shopname;

            const shopAddress: string = event.detail.value.shopaddress;
            const shopLatitude: number = this.data.shopLatitude;
            const shopLongitude: number = this.data.shopLongitude;

            const shopDesc: string = event.detail.value.shopdesc;

            const phoneNumber: string = event.detail.value.shopPhoneNumber;
            const shopImages: any[] = this.data.shopImages;

            const shopCatID: number = this.data.shopCatID;
            const shopDetail: string = '';

            const shopID: number = await api.ShopsApi.createShop(accessToken, shopCatID,
                shopName, shopDesc, phoneNumber, shopAddress, shopLatitude, shopLongitude, logoUrl, shopDetail, shopImages);
            console.log('shopID', shopID);
        }
        wxapi.WxNavigate.navigateBack(1);
    }

    public async onChooseLogoImage(event): Promise<void> {
        console.log('onChooseLogoImage', event);
        try {
            const res: wxapi.WxTypes.WxChooseImageResponse = await wxapi.WxImage.chooseImage(1);

            console.log('res', res);
            
            common.CommonFuncs.showBusy('上传中...');
            const srcFile: string = res.tempFiles[0].path;
            const accessToken: string = utils.storage.accessToken;
    
            const logoUrl: string = await api.UploadApi.uploadFile(accessToken, srcFile);
    
            console.log(logoUrl);
    
            common.CommonFuncs.hideToast();

            this.data.logoUrl = logoUrl;
            this.setData({
                logoUrl: logoUrl,
            });    
        } catch (err) {
            console.log(err);
        }
    }

    public async onChooseShopImage(event): Promise<void> {
        const count = 9 - this.data.shopImages.length;
        try {
            const res: wxapi.WxTypes.WxChooseImageResponse = await wxapi.WxImage.chooseImage(count);
            console.log(res);
            
            common.CommonFuncs.showBusy('上传中...');

            const accessToken: string = utils.storage.accessToken;

            for (const srcFile of res.tempFilePaths) {
                const shopImage: string = await api.UploadApi.uploadFile(accessToken, srcFile);

                this.data.shopImages.push(shopImage);
            }
            common.CommonFuncs.hideToast();

            // this.data.shopImages = this.data.shopImages.concat(res.tempFilePaths);
            this.setData({
                shopImages: this.data.shopImages,
            })
        }
        catch (err) {
            console.log(err);
        }

    }

    public onRemoveShopImage(event) {
        const index = event.currentTarget.dataset.index;
        console.log('onRemoveShopImage', index);
        this.data.shopImages.splice(index, 1);
        this.setData({
            shopImages: this.data.shopImages,
        })
    }

    public onSelectShopCat(event) {
        console.log(event);
        wxapi.WxStorage.setSync('shopCatID', '-1');
        wxapi.WxStorage.setSync('shopCatName', '');
        const url = '/pages/shop/shopjoin/shopcat/shopcat';
        wxapi.WxNavigate.navigateTo(url);
    }

    public onShow() {
        let shopCatID = wxapi.WxStorage.getSync('shopCatID');
        let shopCatName = wxapi.WxStorage.getSync('shopCatName');

        if (shopCatID != '-1') {
            this.data.shopCatID = shopCatID;
            this.data.shopCatName = shopCatName;
            this.setData({
                shopCatID,
                shopCatName,
            })
        }
    }

    public async onChooseLocation(event) {
        try {
            let location: wxapi.WxTypes.WxChooseLocationResponse = await wxapi.WxDevice.chooseLocation();
            console.log(location);
            if (location.errMsg === 'chooseLocation:ok') {
                this.data.shopLatitude = location.latitude;
                this.data.shopLongitude = location.longitude;
                this.setData({
                    shopAddress: location.address,
                })
            }    
        }
        catch(err) {
            console.log(err)
        }
    }

}

export default new ShopJoinPage();