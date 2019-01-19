import * as wxapi from '../../../wxapi/index';
import * as api from '../../../api/index';
import * as common from '../../../common/index';
import * as utils from '../../../utils/index';
import { AppearanceProperty } from 'csstype';
import { func } from 'prop-types';

interface ShopDetailData {
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

    shopQrCode?: string;

    isShowShare?: boolean;
    canvasImagePath?: string;
}

interface ShopDetailOptions {
    shopid?: number;
}

interface TipDialog {
    showTipDialog();
    hideTipDialog();
}

class ShopDetailPage extends common.BasePage {
    private tipDialog: TipDialog;

    public data: ShopDetailData = {
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

        shopQrCode: '',

        isShowShare: false,
        canvasImagePath: '',
    }

    protected setData(data: ShopDetailData) {
        super.setData(data);
    }

    //获取自己的店铺信息
    private async requestMineShopDetailData(): Promise<void> {
        common.CommonFuncs.showBusy('请求中...');

        try {
            if (utils.systemLogin.serverLogined()) {
                const accessToken: string = utils.storage.accessToken;

                const mineShopData: api.ApiTypes.ShopInfoPageData = await api.ShopsApi.getShopPageData(
                    accessToken, 'createDate', true, 0, 3);

                console.log('mineShopData:', mineShopData);

                const isExistShop = (mineShopData.total > 0) ? true : false;

                this.data.shopID = mineShopData.data[0].shopID;
                this.data.logoUrl = mineShopData.data[0].logoUrl;
                this.data.shopName = mineShopData.data[0].shopName;
                this.data.shopAddress = mineShopData.data[0].shopAddress;
                this.data.phoneNumber = mineShopData.data[0].phoneNumber;
                this.data.shopLatitude = mineShopData.data[0].latitude;
                this.data.shopLongitude = mineShopData.data[0].longitude;
                this.data.shopQrCode = await this.getMyQrCode(this.data.shopID);
                // this.data.logoUrl = mineShopData.data[0].logoUrl;
                // this.data.shopImages = mineShopData.data[0].shopImages;
                // this.data.shopCatID = mineShopData.data[0].shopCatID;
                // this.data.shopCatName = mineShopData.data[0].shopCatName;
                if (isExistShop) {
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

                        shopQrCode: this.data.shopQrCode,

                        isShowShare: false,
                    });
                    wxapi.WxNavigate.setNavigationBarTitle(mineShopData.data[0].shopName);
                }
            }
            common.CommonFuncs.hideToast();
        } catch (err) {
            common.CommonFuncs.showModel('请求失败', err);
            console.log('request fail', err);
        }
    };

    //获取别人的店铺信息
    private async requestOtherShopDetailData(): Promise<void> {
        common.CommonFuncs.showBusy('请求中...');

        try {
            const OtherShopData: api.ApiTypes.ShopInfo = await api.MiscApi.getShopInfo(this.data.shopID, true);

            this.data.shopID = OtherShopData.shopID;
            this.data.logoUrl = OtherShopData.logoUrl;
            this.data.shopName = OtherShopData.shopName;
            this.data.shopAddress = OtherShopData.shopAddress;
            this.data.phoneNumber = OtherShopData.phoneNumber;
            this.data.shopLatitude = OtherShopData.latitude;
            this.data.shopLongitude = OtherShopData.longitude;
            this.data.shopQrCode = await this.getMyQrCode(this.data.shopID);
            // this.data.logoUrl = mineShopData.data[0].logoUrl;
            // this.data.shopImages = mineShopData.data[0].shopImages;
            // this.data.shopCatID = mineShopData.data[0].shopCatID;
            // this.data.shopCatName = mineShopData.data[0].shopCatName;
            this.setData({
                shopID: OtherShopData.shopID,

                logoUrl: OtherShopData.logoUrl,
                shopName: OtherShopData.shopName,
                shopAddress: OtherShopData.shopAddress,
                shopDesc: OtherShopData.shopDesc,

                phoneNumber: OtherShopData.phoneNumber,
                shopImages: OtherShopData.shopImages,

                shopCatID: OtherShopData.shopCatID,
                shopCatName: OtherShopData.shopCatName,

                shopQrCode: this.data.shopQrCode,

                isShowShare: false,
            });

            common.CommonFuncs.hideToast();
        } catch (err) {
            common.CommonFuncs.showModel('请求失败', err);
            console.log('request fail', err);
        }
    };
    public async getMyQrCode(myShopId: number): Promise<string> {
        //获取店铺ID的WXACode
        const accessToken = utils.storage.accessToken;
        //"pages/shop/shopdetail/shopdetail?shipid=" + myShopId,
        const wxacode = await api.AccountApi.getWXACode(accessToken,
            "shopID",
            "",
            300,
            true,
            0,
            0,
            0,
            false);
        console.log("2code", wxacode);
        return wxacode;
    }


    public async onLoad(pageUI: common.PageUI, options: ShopDetailOptions): Promise<void> {
        super.onLoad(pageUI, options);
        console.log("options", options);
        this.tipDialog = super.selectComponent("#TipDialog");
        // options.shopid = 6;
        // this.data.shopID = options.shopid;
        if (options.shopid) {
            this.requestOtherShopDetailData();
        } else {//查看自己的店铺
            this.requestMineShopDetailData();
        }
    }

    public onCallPhone(event: Object) {
        console.log(event);
        wxapi.WxDevice.makePhoneCall(this.data.phoneNumber);
    }

    public onViewLocation(event: Object) {
        try {
            wxapi.WxDevice.openLocation(this.data.shopLatitude, this.data.shopLongitude);
        } catch (err) {
            console.log(err);
        }
    }

    public onShowTipDialog(event: Object) {
        this.tipDialog.showTipDialog();
    }

    public onWeChatShare(event: Object) {
        console.log(event);
        this.tipDialog.hideTipDialog();
    
    }

    private drawMultilineText (ctx: wxapi.WxCanvasContext, content: string, leftWidth: number, topHeight: number, fontHeight: number,canvasWidth: number): number {
        let lineWidth = 0;
        let lastSubStrIndex = 0; //每次开始截取的字符串的索引
        let textHeight = 0;
        for (let i = 0; i < content.length; i++) {
          lineWidth += ctx.measureText(content[i]);
          if (lineWidth > canvasWidth - leftWidth*2) {
            ctx.fillText(content.substring(lastSubStrIndex, i), leftWidth, topHeight, canvasWidth);//绘制截取部分
            topHeight += fontHeight;//20为字体的高度
            lineWidth = ctx.measureText(content[i]);
            lastSubStrIndex = i;
            textHeight += fontHeight;
          }
          if (i == content.length - 1) {//绘制剩余部分
            ctx.fillText(content.substring(lastSubStrIndex, i + 1), leftWidth, topHeight, canvasWidth);
          }
        }
        return textHeight;
    }

    private async drawCanvas(): Promise<boolean> {
        common.CommonFuncs.showLoading('生成中,请稍后...');
        try {
            const systemInfo = await wxapi.WxDevice.getSystemInfo();
            //获取Canvas的宽高
            const rpx = systemInfo.windowWidth / 375;

            const canvasWidth = systemInfo.windowWidth * 0.8;
            const canvasHeight = systemInfo.windowHeight * 0.7;

            const canvasLeft: number = 10*rpx; //Canvas左边距
            const canvasTop: number = 10*rpx; //Canvas上边距
            const canvasRight: number = 10*rpx; //右边距
            const canvasBottom: number = 10*rpx; //下编辑
            const canvasSpace: number = 10*rpx;
            const circleR: number = 32*rpx;//圆半径

            const avatarUrl: string = utils.storage.accountInfo.userInfo.avatarUrl;
            let imageInfo = await wxapi.WxImage.getImageInfo(avatarUrl);
            let imageWidth = imageInfo.width;
            let imageHeight = imageInfo.height;

            const ctx = new wxapi.WxCanvasContext('shareCanvas');
            //背景填充白色
            ctx.setFillStyle('#fff');
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            //保存状态，clip()后恢复原状态
            ctx.save();
            //画头像
            ctx.arc(canvasLeft + circleR, canvasTop + circleR, circleR, 0, Math.PI * 2, 0);
            ctx.fill();
            ctx.clip();
            ctx.drawImage(avatarUrl, 0, 0, imageWidth, imageHeight, canvasLeft, canvasTop, circleR * 2, circleR * 2);

            ctx.restore();

            //画文字(店铺名称)
            ctx.setFillStyle('#000000');
            ctx.setFont('normal bold 16px sans-serif');
            ctx.fillText(this.data.shopName, canvasLeft + circleR*2 + canvasSpace, canvasTop + canvasSpace*2, canvasWidth - canvasLeft - circleR*2 - canvasSpace - canvasRight);

            //画店铺首图
            imageInfo = await wxapi.WxImage.getImageInfo(this.data.logoUrl);
            imageWidth = imageInfo.width;
            imageHeight = imageInfo.height;
            const tmpCanvasHeight = (canvasWidth - canvasSpace*2) / 1.5;
            ctx.drawImage(this.data.logoUrl, 0, 0, imageWidth, imageHeight, canvasLeft, canvasTop + circleR*2 + canvasSpace, canvasWidth - canvasSpace*2, tmpCanvasHeight);

            //画二维码
            imageInfo = await wxapi.WxImage.getImageInfo(this.data.shopQrCode);
            imageWidth = imageInfo.width;
            imageHeight = imageInfo.height;
            const qrCodeWidth = 100*rpx;
            const qrCodeHeight = 100*rpx;
            ctx.drawImage(this.data.shopQrCode, 0, 0, imageWidth, imageHeight, canvasWidth - qrCodeWidth - canvasRight, canvasTop + circleR*2 + canvasSpace + tmpCanvasHeight + canvasSpace, qrCodeWidth, qrCodeHeight);

            //画地址
            ctx.setFont('italic 14px sans-serif');
            // ctx.setFontSize(14);
            const content = '地址：' + this.data.shopAddress;
            const contentTopHeight = canvasTop + circleR*2 + canvasSpace + tmpCanvasHeight + canvasSpace*3;
            const fontHeight = 20;
            const contentCanvasWidth = canvasWidth - canvasLeft - canvasRight - qrCodeWidth - canvasSpace;
            const contentHeight = rpx * this.drawMultilineText(ctx, content, canvasLeft, contentTopHeight, fontHeight, contentCanvasWidth);

            //画电话
            const phoneNumberTopHeight = contentTopHeight + contentHeight + canvasSpace*3;
            const phoneNumberCanvasWidth = canvasWidth - canvasLeft - circleR*2 - canvasSpace - canvasRight;
            ctx.fillText('电话：' + this.data.phoneNumber, canvasLeft, phoneNumberTopHeight, phoneNumberCanvasWidth);

            ctx.draw(true, async () => {
                try {
                    const canvasImagePath: string = await ctx.saveToTempFilePath();
                    
                    // const info = await wxapi.WxImage.getImageInfo(canvasImagePath);
                    // console.log(info);

                    this.setData({
                        canvasImagePath,
                    });
                } catch (err) {
                    console.error(err);
                }
            });

            common.CommonFuncs.hideLoading();
            return true;
        } catch (err) {
            common.CommonFuncs.hideLoading();
            common.CommonFuncs.showModel('生成失败', err);
            return false;
        }
    }

    private setShopShare(isShowShare: boolean) {
        this.data.isShowShare = isShowShare;
        this.setData({
            isShowShare: this.data.isShowShare,
        });
    }

    public async onShopShare(event: Object) {
        console.log(event);
        this.tipDialog.hideTipDialog();
        const isSuccess = await this.drawCanvas();
        if (isSuccess) {
            this.setShopShare(true);
        }
    }

    public onHideShare(event: Object) {
        this.setShopShare(false);
    }

    public onCanvasImageClick(event: Object) {
        wxapi.WxImage.previewImage(this.data.canvasImagePath,[this.data.canvasImagePath]);
    }

    public onShareAppMessage(options: Object) {
        console.log('sharePage', options);
        return {
            title: this.data.shopName,
            path: '/pages/shop/shopdetail/shopdetail?shopID=' + this.data.shopID,
            //   imageUrl: '/images/image_artist@2x.png',
        }
    }
}

export default new ShopDetailPage();