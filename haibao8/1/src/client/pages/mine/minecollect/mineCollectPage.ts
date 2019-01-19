import * as api from '../../../api/index';
import * as wxapi from '../../../wxapi/index';
import * as common from '../../../common/index';
import * as utils from '../../../utils/index';

interface MineCollectData {
	posterList?: api.ApiTypes.PosterInfo[];
}

class MinesCollectPage extends common.BasePage {

	public data: MineCollectData = {
		posterList: [],
	};

	protected setData(data: MineCollectData) {
		super.setData(data);
	}

	// 生命周期函数--监听页面加载
	public async onLoad(pageUI: common.PageUI, options: Object): Promise<void> {
		super.onLoad(pageUI, options);

		this.requestMineCollectData();
	}

	
	private async requestMineCollectData(): Promise<void> {
		common.CommonFuncs.showBusy('请求中...');

		try {
			if (utils.systemLogin.serverLogined()) {
				const accessToken: string = utils.storage.accessToken;

        		const mineCollectPosterData: api.ApiTypes.PosterFavoritePageData = await api.PosterFavoritesApi.queryPosterFavoritePageData(accessToken);

				console.log('mineCollectPosterData:', mineCollectPosterData);
				
				const posterList: api.ApiTypes.PosterInfo[] = [];

				for (const item of mineCollectPosterData.data) {
					item.posterInfo['editIsShow'] 	= false;
					item.posterInfo['removeIsShow'] = true;
					item.posterInfo['thumbUrl'] 	= api.ApiTypes.makeThumbUrl(item.posterInfo.posterUrl, 100)
					posterList.push(item.posterInfo);	
				}

				this.data.posterList = posterList;

				this.setData({
					posterList: posterList,
				});
				
				console.log('posterList:', posterList);
			}

			common.CommonFuncs.hideToast();
		} catch (err) {
			common.CommonFuncs.showModel('请求失败', err);
			console.log('request fail', err);
		}
	};

	public async onRemovePoster(event): Promise<void> {
		const isOK: boolean = await common.CommonFuncs.showDialogBox('确定删除吗？','删除后将无法找回');
		if (isOK) {
			console.log('RemovePoster', event);

			const accessToken: string = utils.storage.accessToken;
			const posterID: number = event.currentTarget.dataset.posterpro.posterID;
			//删除收藏的海报
			const IsRemove = await api.PosterFavoritesApi.removePosterFromFavorite(accessToken, posterID);

			if (IsRemove) {
				let index: number = -1;
				for (let i = 0; i < this.data.posterList.length; i++) {
					if (this.data.posterList[i].posterID == posterID) {
						index = i;
						break;
					}
				}

				this.data.posterList.splice(index, 1);
				this.setData({
					posterList: this.data.posterList,
				})
		
			}
		}

	}
}

export default new MinesCollectPage();