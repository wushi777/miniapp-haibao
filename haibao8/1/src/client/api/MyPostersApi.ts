import * as ApiTypes    from './ApiTypes';
import { ApiHttp }      from './ApiHttp';

export class MyPostersApi {
    // 创建我的一个海报
    public static async createMyPoster(
        accessToken:        string,
        myPosterName:       string,
        myPosterDesc:       string,
        myPosterUrl:        string,
        posterID:           number
    ): Promise<number> {
        const params = {
            accessToken,
            myPosterName,
            myPosterDesc,
            myPosterUrl,
            posterID
        };

        const path: string = '/api/account/myposters';
        const myPosterID: number = await ApiHttp.post(path, params);
        return myPosterID;
    }

    // 删除我的一个海报
    public static async deleteMyPoster(
        accessToken:    string,    
        myPosterID:     number
    ): Promise<boolean> {
        const params = {
            accessToken
        };

        const path: string = `/api/account/myposters/${myPosterID}`;
        const result: boolean = await ApiHttp.delete(path, params);
        return result;
    }

    // 修改我的一个海报
    public static async modifyMyPoster(
        accessToken:    string,
        myPosterID:     number,
        params:         ApiTypes.MyPosterEditableInfo
    ): Promise<boolean> {
        const data = {
            accessToken,
            ...params
        };

        const path: string = `/api/account/myposters/${myPosterID}`;
        const result: boolean = await ApiHttp.put(path, params);
        return result;
    }

    // 获取我的一个海报的信息
    public static async getMyPosterInfo(
        accessToken:    string,
        myPosterID:     number
    ): Promise<ApiTypes.MyPosterInfo> {
        const params = {
            accessToken
        };

        const path: string = `/api/account/myposters/${myPosterID}`;
        const result: ApiTypes.MyPosterInfo = await ApiHttp.get(path, params);
        return result;
    }

    // 获取我的海报的分页数据
    public static async getMyPosterPageData(
        accessToken:    string,
        sort:           string,
        desc:           boolean,
        from:           number,
        count:          number
    ): Promise<ApiTypes.MyPosterInfoPageData> {
        const params = {
            accessToken,
            sort,
            desc,
            from,
            count
        };

        const path:     string = '/api/account/myposters';
        const result:   ApiTypes.MyPosterInfoPageData = await ApiHttp.get(path, params);
        return result;
    }
}