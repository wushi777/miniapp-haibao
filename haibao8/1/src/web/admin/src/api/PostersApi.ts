import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

export class PostersApi extends BaseApi {
    public async queryPosterPageData(
        posterCatID:  	number, 
        startDate:  	number, 
        endDate:    	number,
        
        q:              string,
        sort:       	string, 
        desc:       	boolean, 
        from:       	number, 
        count:      	number
    ): Promise<ApiTypes.PosterInfoPageData> {
        const params = {
            posterCatID,
            q,
            sort,
            desc,
            from,
            count,
            startDate,
            endDate
        };

        const data: ApiTypes.PosterInfoPageData = await this.http.get('/api/admin/posters', params);
        return data;
    }

    public async createPoster(
        posterCatIDs:   number[],
        posterName:     string,
        posterDesc:     string,
        posterData:     string,
        posterUrl:      string
        // thumbUrl:       string
    ): Promise<number> {
        const params = {
            posterCatIDs,
            posterName,
            posterDesc,
            posterData,
            posterUrl
            // thumbUrl
        };

        const posterID: number = await this.http.post('/api/admin/posters', params);
        return posterID;
    }

    public async modifyPoster(posterID: number, params: ApiTypes.PosterEditableInfo): Promise<boolean> {
        const result: boolean = await this.http.put(`/api/admin/posters/${posterID}`, params);
        return result;
    }

    public async deletePoster(posterID: number): Promise<boolean> {
        const params = {};
        const result: boolean = await this.http.delete(`/api/admin/posters/${posterID}`, params);
        return result;
    }
}