import * as ApiTypes    from './ApiTypes';
import { ApiHttp }      from './ApiHttp';
import * as wxapi       from '../wxapi/index';

export class MiscApi {
    // 获取Poster的首页全部数据
    public static async getPosterHomeData(
        sort:   string,
        desc:   boolean,
        from:   number,
        count:  number
    ): Promise<ApiTypes.PosterHomeData> {
        const params = {
            sort,
            desc,
            from,
            count
        };

        const path: string = `/api/misc/posters-homedata`
        const data: ApiTypes.PosterHomeData = await ApiHttp.get(path, params);
        return data;
    }

    //获取Poster更多页全部数据
    public static async getPosterMoreData(
        posterCatID:    number,
        sort:           string,
        desc:           boolean,
        from:           number,
        count:          number
    ): Promise<ApiTypes.PosterMoreData> {
        const params = {
            posterCatID,
            sort,
            desc,
            from,
            count
        };

        const path: string = `/api/misc/posters-moredata`
        const data: ApiTypes.PosterMoreData = await ApiHttp.get(path, params);
        return data;
    }

    // 获取指定分类的poster分页数据
    public static async getPosterPageData(
        posterCatID:    number,
        sort:           string,
        desc:           boolean,
        from:           number,
        count:          number
    ): Promise<ApiTypes.PosterInfoPageData> {
        const params = {
            posterCatID,

            startDate:  0,
            endDate:    0,
            q:          '',

            sort,
            desc,
            from,
            count
        };

        const path:     string = `/api/misc/posters`;
        const result:   ApiTypes.PosterInfoPageData = await ApiHttp.get(path, params);
        return result;
    }

    //根据 posterID 获取一个 Poster 的详细信息
    public async getPosterInfo(
        posterID:           number,
        updateViewTimes:    boolean  // 是否更新展示次数
    ): Promise<ApiTypes.PosterInfo> {
        const params = {
            updateViewTimes
        };

        const path:     string = `/api/misc/posters/${posterID}`
        const result:   ApiTypes.PosterInfo = await ApiHttp.get(path, params);
        return result;
    }

    // 获取Shop的首页全部数据
    public static async getShopHomeData(
        sort:   string,
        desc:   boolean,
        from:   number,
        count:  number
    ): Promise<ApiTypes.ShopHomeData> {
        const params = {
            sort,
            desc,
            from,
            count
        };

        const path: string = `/api/misc/shops-homedata`
        const data: ApiTypes.ShopHomeData = await ApiHttp.get(path, params);
        return data;
    }

    //根据 shopID 获取一个 Shop 的详细信息
    public static async getShopInfo(
        shopID:             number,
        updateViewTimes:    boolean // 是否更新展示次数
    ): Promise<ApiTypes.ShopInfo> {
        const params = {
            updateViewTimes
        };
        
        const path:     string = `/api/misc/shops/${shopID}`;
        const result:   ApiTypes.ShopInfo = await ApiHttp.get(path, params);
        return result;
    }

    // 获取店铺分类数组
    public static async getShopCatList(): Promise<ApiTypes.ShopCatInfo[]> {
        const params = {};
        const path:     string = '/api/misc/shopcats';
        const result:   ApiTypes.ShopCatInfo[] = await ApiHttp.get(path, params);
        return result;
    }

    // 下载一个文件, 下载成功返回文件在本地的临时路径
    public static async downloadFile(
        url:    string
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const download = new wxapi.WxDownloadFile(url);

            download.onSuccess = (tempFilePath: string) => {
                resolve(tempFilePath);
            }

            download.onFail = (err: any) => {
                reject(err);
            }

            download.download();
        });
    }
}