import * as wxapi from '../../../wxapi/index';
import * as api from '../../../api/index';
import * as common from '../../../common/index';
import * as utils from '../../../utils/index';

interface PosterListData {
	activeIndex?: number;
	allCats?: api.ApiTypes.PosterCatInfo[];
	posterList?: api.ApiTypes.PosterInfo[];
}

interface PosterListOptions {
	postercatid: number;
}

class PosterListPage extends common.BasePage {
	public data: PosterListData = {
		activeIndex: 0,
		allCats: [],
		posterList: []
	}

	protected setData(data: PosterListData): void {
		super.setData(data);
	}

	public async onLoad(pageUI: common.PageUI, options: PosterListOptions): Promise<void> {
		super.onLoad(pageUI, options);
		await this.getPostersMoreData(options.postercatid);
	}

	public async getPostersMoreData(posterCatID: number): Promise<void> {
		common.CommonFuncs.showBusy('请求中...');

		try {
			const postersMoreData: api.ApiTypes.PosterMoreData = await api.MiscApi.getPosterMoreData(
				posterCatID, 'createDate', true, 0, 5);

			console.log('postersMoreData:', postersMoreData);

			let posterList: api.ApiTypes.PosterInfo[] = [];

			for (const cat of postersMoreData.cats) {
				// const tmp = {posterType: "cat" ,posterCatID: cat.posterCatID, posterCatName: cat.posterCatName};
				// allTags.push(tmp);
				if (cat.posters) {
					for (const item of cat.posters.data) {
						item['editIsShow'] 		= true;
						item['removeIsShow'] 	= false;
						item['thumbUrl'] 		= api.ApiTypes.makeThumbUrl(item.posterUrl, 100);
					}
	
					posterList = [].concat(cat.posters.data);
					break;
				}
			}

			console.log('posterList', posterList);

			this.setData({
				activeIndex: posterCatID,
				posterList: posterList,
				allCats: postersMoreData.cats,
			});

			common.CommonFuncs.hideToast();
		} catch (err) {
			common.CommonFuncs.showModel('请求失败', err);
		}
	}

	public async getPosterPageData(posterCatID: number): Promise<void> {
		common.CommonFuncs.showBusy('请求中...');

		try {
			const posterPageData: api.ApiTypes.PosterInfoPageData = await api.MiscApi.getPosterPageData(
				posterCatID, 'createDate', true, 0, 5);

			console.log('getPosterPageData:', posterPageData);

			const posterList = [].concat(posterPageData.data);

			for (const item of posterList) {
				item['thumbUrl'] = api.ApiTypes.makeThumbUrl(item.posterUrl, 100);
			}

			this.setData({
				activeIndex: posterCatID,
				posterList: posterList,
			})

			common.CommonFuncs.hideToast();
		} catch (err) {
			common.CommonFuncs.showModel('请求失败', err);
		}
	}

	public async changeTab(event): Promise<void> {
		console.log(event);
		const currCatID: number = event.currentTarget.dataset.id;
		this.getPosterPageData(currCatID);
	}

	public async onScrollLower(event): Promise<void> {
		console.log(event);
	}

	public async onPosterEditTap(event): Promise<void> {
		console.log(event);
		if (utils.systemLogin.serverLogined()) {
			const posterId = event.currentTarget.dataset.posterpro.posterID;
			const posterUrl = event.currentTarget.dataset.posterpro.posterUrl;

			const url: string = `/pages/poster/postereditor/postereditor?id=${posterId}&posterurl=${posterUrl}`;
			wxapi.WxNavigate.navigateTo(url);
		} else {
			const url: string = '/pages/login/login';
			wxapi.WxNavigate.navigateTo(url);
		}

	}
}

export default new PosterListPage();