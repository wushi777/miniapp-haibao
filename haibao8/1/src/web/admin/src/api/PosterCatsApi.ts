import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

export class PosterCatsApi extends BaseApi {
    public async queryPosterCatPageData(
        q:      string,
        sort:   string, 
        desc:   boolean,
        from:   number, 
        count:  number
    ): Promise<ApiTypes.PosterCatPageData> {
        const params = {
            q,
            sort,
            desc,
            from,
            count            
        };

        const data: ApiTypes.PosterCatPageData = await this.http.get('/api/admin/postercats', params);
        return data;
    }

    public async createPosterCat(
        posterCatName:  string, 
        posterCatDesc:  string,
        hotspot:        boolean,
        orderNum:       number
    ): Promise<number> {
        const params = {
            posterCatName,
            posterCatDesc,
            hotspot,
            orderNum
        };

        const posterCatID: number = await this.http.post('/api/admin/postercats', params);
        return posterCatID;
    }

    public async modifyPosterCat(posterCatID: number, params: ApiTypes.PosterCatEditableInfo): Promise<boolean> {
        const result: boolean = await this.http.put(`/api/admin/postercats/${posterCatID}`, params);
        return result;
    }

    public async deletePosterCat(posterCatID: number): Promise<boolean> {
        const params = {};
        const result: boolean = await this.http.delete(`/api/admin/postercats/${posterCatID}`, params);
        return result;
    }
}