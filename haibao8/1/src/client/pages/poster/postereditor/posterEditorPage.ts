import * as api from '../../../api/index';
import * as wxapi from '../../../wxapi/index';
import * as common from '../../../common/index';
import * as utils from '../../../utils/index';

declare const wx;

interface ElementInfo {
	id: string,
	left: number,
	top: number,
	right: number,
	bottom: number,
	width: number,
	height: number,
}

interface PosterEditorData {
	posterId?: number;
	posterUrl?: string;
	posterData?: Array<Object>;

	isShowCanvas?: boolean;
}

interface PosterEditorOptions {
	posterId: number;
	posterUrl: string;
	posterData: string;
}

interface InputEvent {
	Id: number;
	contentText: string;
}
interface TipInput {
	hideTipInput();
	showTipInput(Id: number, textMaxLength: number, contentText: string);
}

class PosterEditorPage extends common.BasePage {
	private tipInput: TipInput;

	public data: PosterEditorData = {
		posterId: 0,
		posterUrl: '',
		posterData: [],
	}

	protected setData(data: PosterEditorData) {
		super.setData(data);
	}

	// 生命周期函数--监听页面加载
	public async onLoad(pageUI: common.PageUI, options: PosterEditorOptions): Promise<void> {
		super.onLoad(pageUI, options);

		console.log("options", options);

		this.tipInput = super.selectComponent("#TipInput");

		this.data.posterId = options.posterId;
		const imageInfo = await wxapi.WxImage.getImageInfo(options.posterUrl);
		console.log('imageInfoPath',imageInfo.path);
		this.data.posterUrl = imageInfo.path;
		// this.data.posterUrl = options.posterUrl;

		let posterData = JSON.parse(options.posterData);
		for (const item of posterData) {
			if (item['isText']) {//如果是文本
				if (item['inputType'] == 1) {//0是普通文本，1是用户昵称
					item['inputText'] = utils.storage.accountInfo.userInfo.nickName;
				}
			} else {//如果是图片
				if (item['inputType'] == 1) {//0是普通图片，1是用户头像，2是二维码
					item['imagePath'] = utils.storage.accountInfo.userInfo.avatarUrl;
				} else if (item['inputType'] == 2) {
					const qrcode = await this.getMyQrCode(0)
					item['imagePath'] = qrcode;
				}

			}
		}

		this.data.posterData = posterData,

			this.setData({
				posterId: this.data.posterId,
				posterUrl: this.data.posterUrl,
				posterData: this.data.posterData,
			})

	}

	public onInputOK(event) {
		console.log(event);
		let posterData = this.data.posterData;
		posterData[event.detail.Id]['inputText'] = event.detail.contentText;
		this.setData({
			posterData: posterData,
		})
		this.tipInput.hideTipInput();
	}

	public async onShowTipInput(event) {

		console.log(event);
		const id = event.currentTarget.dataset.id;

		const isText = event.currentTarget.dataset.istext;
		if (isText) {
			const contentText = event.currentTarget.dataset.text;
			const textMaxLength = this.data.posterData[id]['textMaxLength'];
			this.tipInput.showTipInput(id, textMaxLength, contentText);
		} else {
			const res: wxapi.WxTypes.WxChooseImageResponse = await wxapi.WxImage.chooseImage(1);

			const imagePath: string = res.tempFiles[0].path;
			let posterData = this.data.posterData;

			posterData[id]['imagePath'] = imagePath;
			this.setData({
				posterData: posterData,
			})
		}
	}

	public async getMyQrCode(myShopId: number): Promise<string> {
		//获取店铺ID的WXACode
		const accessToken = utils.storage.accessToken;
		//"pages/shop/shopdetail/shopdetail?shipid=" + myShopId,
		const wxacode = await api.AccountApi.getWXACode(accessToken,
			"shopID",
			" ",
			300,
			true,
			0,
			0,
			0,
			false);
		console.log("2code", wxacode);
		return wxacode;
	}

	public async onSaveImage(): Promise<void> {
		let s;
		const ctx = new wxapi.WxCanvasContext('mycanvas');
		const r: string = await ctx.saveToTempFilePath('png', 1);

		const accessToken = utils.storage.accessToken;
		const upFileURL = await api.UploadApi.uploadFile(accessToken, r);

		//将此URL 给到服务器，

		//		let avator = utils.storage.accountInfo.userInfo.avatarUrl;
		//		ctx.drawImage(avator, 0, 0, 200, 200, 0,0,100,100);
		//		await ctx.draw(true);
	}

	private async getElementInfo(eName: string): Promise<any> {
		return new Promise<void>((resolve, reject) => {
			const query = wx.createSelectorQuery();
			query.select('#' + eName).boundingClientRect();
			query.exec(function (res) {
				//   console.log(res[0]);
				resolve(res[0]);
			})
		});
	}


	/*
	 * @param {CanvasContext} ctx canvas上下文
	 * @param {number} x 圆角矩形选区的左上角 x坐标
	 * @param {number} y 圆角矩形选区的左上角 y坐标
	 * @param {number} w 圆角矩形选区的宽度
	 * @param {number} h 圆角矩形选区的高度
	 * @param {number} r 圆角的半径
	 */

	private roundRect(ctx, x, y, w, h, r) {
		// 开始绘制
		ctx.beginPath()
		// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
		// 这里是使用 fill 还是 stroke都可以，二选一即可
		ctx.setFillStyle('#fff')
		// ctx.setStrokeStyle('transparent')
		// 左上角
		ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

		// border-top
		ctx.moveTo(x + r, y)
		ctx.lineTo(x + w - r, y)
		ctx.lineTo(x + w, y + r)
		// 右上角
		ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

		// border-right
		ctx.lineTo(x + w, y + h - r)
		ctx.lineTo(x + w - r, y + h)
		// 右下角
		ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

		// border-bottom
		ctx.lineTo(x + r, y + h)
		ctx.lineTo(x, y + h - r)
		// 左下角
		ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

		// border-left
		ctx.lineTo(x, y + r)
		ctx.lineTo(x + r, y)

		// 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
		ctx.fill()
		// ctx.stroke()
		ctx.closePath()
		// 剪切
		ctx.clip()
	}

	public async drawCanvas(): Promise<void> {
		common.CommonFuncs.showLoading('生成中,请稍后...');
		try {
			const systemInfo = await wxapi.WxDevice.getSystemInfo();
			//获取Canvas的宽高
			const rpx = systemInfo.windowWidth / 375;
	
			const canvasWidth = systemInfo.windowWidth;
			const canvasHeight = systemInfo.windowHeight * 0.9;
		
			const ctx = new wxapi.WxCanvasContext('shareCanvas');
			//背景填充白色
			// ctx.setFillStyle('#fff');
			// ctx.fillRect(0, 0, canvasWidth, canvasHeight);
			//画背景
			const imageInfo = await wxapi.WxImage.getImageInfo(this.data.posterUrl);
			let imageWidth = imageInfo.width;
			let imageHeight = imageInfo.height;
			ctx.drawImage(imageInfo.path, 0, 0, imageWidth, imageHeight, 0, 0, canvasWidth, canvasHeight);
	
			for (const item of this.data.posterData) {
				if (item['isText']) {//如果是文本
					const eInfo: ElementInfo = await this.getElementInfo(item['name']);
					console.log(eInfo);
	
					ctx.setFillStyle(item['fontColor']);
					const fontStyle = item['fontStyle'] + ' ' + item['fontVariant'] + ' ' + item['fontWeight'] + ' ' + Math.round(item['fontSize']*rpx)+'px' + ' ' + item['fontFamily'];
					ctx.setFont(fontStyle);
					const inputText = item['inputText'].split(/[\n]/g);
					for(let i = 0; i < inputText.length; i++){
						ctx.fillText(inputText[i], eInfo.left, eInfo.top + i * (item['fontSize']*rpx) + (item['fontSize']*rpx) - 2, eInfo.width);
					}

				} else {//图片
					const eInfo: ElementInfo = await this.getElementInfo(item['name']);
					console.log(eInfo);
	
					const imageInfo = await wxapi.WxImage.getImageInfo(item['imagePath']);
					console.log(item['name'],imageInfo.path);
					const imageWidth = imageInfo.width;
					const imageHeight = imageInfo.height;
	
	
					ctx.save();
	
					// ctx.beginPath();
					// if (item['isCircle']) {//如果是圆形
					// 	ctx.arc(eInfo.left + eInfo.width / 2, eInfo.top + eInfo.height / 2, eInfo.width / 2, 0, Math.PI * 2, 0);
					// 	// ctx.setFillStyle('transparent');
					// 	ctx.fill();
					// 	ctx.clip();
					// }
					this.roundRect(ctx,eInfo.left, eInfo.top, eInfo.width, eInfo.height, item['hornRadius']*rpx);
					ctx.drawImage(imageInfo.path, 0, 0, imageWidth, imageHeight, eInfo.left, eInfo.top, eInfo.width, eInfo.height);
	
					ctx.restore();
				}
			}
	
			ctx.draw(true, async () => {
				try {
					const canvasImagePath: string = await ctx.saveToTempFilePath();
	
					const info = await wxapi.WxImage.getImageInfo(canvasImagePath);
					console.log(canvasImagePath);

					const url: string = `../postershare/postershare?posterPic=${canvasImagePath}`;
					wxapi.WxNavigate.navigateTo(url);	
	
				} catch (err) {
					console.error(err);
				}
			});
	
			common.CommonFuncs.hideLoading();
		} catch (err) {
			common.CommonFuncs.hideLoading();
			common.CommonFuncs.showModel('生成失败', err);
		}

	}


	public async onGeneratePoster() {
		await this.drawCanvas();
	}

	public async onPosterCollect(event: Object) {
		if (utils.systemLogin.serverLogined()) {
			const accessToken: string = utils.storage.accessToken;
			try {
				const IsCollect = await api.PosterFavoritesApi.addPosterToFavorite(accessToken, this.data.posterId);
				if (IsCollect) {
					common.CommonFuncs.showSuccess('收藏成功');
				}
			}
			catch (err) {
				common.CommonFuncs.showModel('收藏失败', err.message);
			}


		} else {
			const url: string = '/pages/login/login';
			wxapi.WxNavigate.navigateTo(url);
		}
	}

}

export default new PosterEditorPage();