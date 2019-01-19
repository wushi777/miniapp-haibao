import * as ApiTypes    from './ApiTypes';
import { ApiHttp }      from './ApiHttp';

export class PosterFavoritesApi {
    // 添加海报到我的收藏
    public static async addPosterToFavorite(
        accessToken:    string,
        posterID:       number
    ): Promise<boolean> {
        const params = {
            accessToken,
            posterID
        };

        const path:     string  = '/api/account/posterfavorites';
        const result:   boolean = await ApiHttp.post(path, params);
        return result;
    }

    // 从我的收藏中移除海报
    public static async removePosterFromFavorite(
        accessToken:    string,
        posterID:       number
    ): Promise<boolean> {
        const params = {
            accessToken
        };

        const path:     string  = `/api/account/posterfavorites/${posterID}`;
        const result:   boolean = await ApiHttp.delete(path, params);
        return result;
    }

    // 获取我的收藏里的一条海报记录
    public static async getPosterFavoriteInfo(
        accessToken:    string,
        posterID:       number
    ): Promise<ApiTypes.PosterFavoriteInfo> {
        const params = {
            accessToken
        };

        const path: string  = `/api/account/posterfavorites/${posterID}`;
        const info: ApiTypes.PosterFavoriteInfo = await ApiHttp.get(path, params);
        return info;
    }

    // 获取我的海报收藏的分页数据
    public static async queryPosterFavoritePageData(
        accessToken:    string
    ): Promise<ApiTypes.PosterFavoritePageData> {
        const params = {
            accessToken
        };

        const path: string  = `/api/account/posterfavorites`;
        const info: ApiTypes.PosterFavoritePageData = await ApiHttp.get(path, params);
        return info;
    }
}