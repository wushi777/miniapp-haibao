import * as wxapi from '../../wxapi/index';
import * as api from '../../api/index';
import * as common from '../../common/index';
import * as utils from '../../utils/index';

interface PosterData {
    swiperImgList?: api.ApiTypes.PosterSlideInfo[];
    posterTagList?: api.ApiTypes.PosterCatInfo[];
    posterCatsList?: api.ApiTypes.PosterCatInfo[];
    indicatorDots?: boolean;
    autoplay?: boolean;
    interval?: number;
    duration?: number;
}

class PosterPage extends common.BasePage {
    public data: PosterData = {
        swiperImgList: [],
        posterTagList: [],
        posterCatsList: [],
        indicatorDots: false,
        autoplay: true,
        interval: 3000,
        duration: 1000,
    }

    protected setData(data: PosterData): void {
        super.setData(data);
    }

    public async onLoad(pageUI: common.PageUI, options: Object): Promise<void> {
        super.onLoad(pageUI, options);
        await this.requestPosterData();
    }

    private async requestPosterData(): Promise<void> {
        common.CommonFuncs.showBusy('请求中...');

        try {
            const posterHomeData: api.ApiTypes.PosterHomeData = await api.MiscApi.getPosterHomeData(
                'createDate', true, 0, 5);

            console.log('posterHomeData:', posterHomeData);

            const posterTagList: api.ApiTypes.PosterCatInfo[] = [];
            const posterCatsList: api.ApiTypes.PosterCatInfo[] = [];

            for (const cat of posterHomeData.cats) {
                for (const item of cat.posters.data) {
                    item['editIsShow'] = true;
                    item['removeIsShow'] = false;
                    item['thumbUrl'] = api.ApiTypes.makeThumbUrl(item.posterUrl, 100);
                }

                if (cat.hotspot) {
                    posterTagList.push(cat);
                } else {
                    posterCatsList.push(cat);
                }
            }

            this.setData({
                swiperImgList: posterHomeData.slides,
                posterTagList: posterTagList,
                posterCatsList: posterCatsList,
            });

            common.CommonFuncs.hideToast();
        } catch (err) {
            common.CommonFuncs.showModel('请求失败', err);
        }
    }

    public async onTagBtnClick(event): Promise<void> {
        const posterCatID: number = event.currentTarget.dataset.id;
        // const posterType = 'tag';
        console.log('posterCatID', posterCatID);

        const url: string = `/pages/poster/posterlist/posterlist?postercatid=${posterCatID}`;
        await wxapi.WxNavigate.navigateTo(url);
    }

    public async onPosterEditTap(event): Promise<void> {
        console.log(event);
        if (utils.systemLogin.serverLogined()) {
            const posterId: number = event.currentTarget.dataset.posterpro.posterID;
            const posterUrl: string = event.currentTarget.dataset.posterpro.posterUrl;
            const posterData = event.currentTarget.dataset.posterpro.posterData;

            const url: string = `postereditor/postereditor?posterId=${posterId}&posterUrl=${posterUrl}&posterData=${posterData}`;
            await wxapi.WxNavigate.navigateTo(url);
        } else {
            const url: string = '/pages/login/login';
            wxapi.WxNavigate.navigateTo(url);
        }
    }

    public async onMorePoster(event): Promise<void> {
        console.log('onMorePoster', event);
        const posterCatID: number = event.currentTarget.dataset.category.posterCatID;
        console.log('posterCatID', posterCatID);

        const url: string = `/pages/poster/posterlist/posterlist?postercatid=${posterCatID}`;
        await wxapi.WxNavigate.navigateTo(url);
    }

    public async onDownRefresh(event) {
        console.log(event);
    }
}

export default new PosterPage();