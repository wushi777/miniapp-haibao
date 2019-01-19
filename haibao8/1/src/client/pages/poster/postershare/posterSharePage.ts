
import * as api     from '../../../api/index';
import * as wxapi   from '../../../wxapi/index';
import * as common  from '../../../common/index';
import * as utils   from '../../../utils/index';
import { StreamState } from 'http2';

interface PosterShareOptions {
	posterPic?: string;
	isWritePhotosAlbum?: boolean;
}

class PosterSharePage extends common.BasePage {
    public data: PosterShareOptions = {
		posterPic: '',
		isWritePhotosAlbum: true,
    }

    protected setData(data: PosterShareOptions) {
        super.setData(data);
    }

	// 生命周期函数--监听页面加载
    public async onLoad(pageUI: common.PageUI, options: PosterShareOptions): Promise<void> {
		super.onLoad(pageUI, options);

		console.log("options", options);

		this.data.posterPic = options.posterPic;

		const authSetting = await wxapi.WxOpen.getSetting();
		if ('scope.writePhotosAlbum' in authSetting) {
			this.data.isWritePhotosAlbum = authSetting['scope.writePhotosAlbum'];
		} else {
			this.data.isWritePhotosAlbum = true;
		}

		this.setData({
			posterPic: this.data.posterPic,
			isWritePhotosAlbum: this.data.isWritePhotosAlbum,
		})

	}

	public onOpenSetting(event) {
		if (event.detail.authSetting['scope.writePhotosAlbum']) {
			this.setData({
			  isWritePhotosAlbum: true,
			})      
		}	  
	}

	public onCanvasImageClick(event) {
        wxapi.WxImage.previewImage(this.data.posterPic,[this.data.posterPic]);
	}

    public onShareAppMessage(options: Object) {
        console.log('sharePage', options);
        return {
            title: '海报',
            path: '/pages/poster/postershare/postershare',
            //   imageUrl: '/images/image_artist@2x.png',
        }
    }

	public async onDownloadPic(event) {
		try {
			await wxapi.WxImage.saveImageToPhotosAlbum(this.data.posterPic);
		} catch (err) {
			console.log(err);
		}
	}

}

export default new PosterSharePage();