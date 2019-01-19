import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

export class PosterSlidesApi extends BaseApi {
    public async queryPosterSlidePageData(
        q:		string,
        sort:   string,
        desc:   boolean,
        from:	number, 
        count:	number
    ): Promise<ApiTypes.PosterSlidePageData> {
        const params = {
            q,
            sort,
            desc,
            from,
            count
        };

        const data: ApiTypes.PosterSlidePageData = await this.http.get('/api/admin/posterslides', params);
        return data;
    }

    public async createPosterSlide(
        posterSlideName:    string, 
        posterSlideDesc:    string,
        posterSlideUrl:     string,
        posterSlideLink:    string,
        orderNum:           number
    ): Promise<number> {
        const params = {
            posterSlideName,
            posterSlideDesc,
            posterSlideUrl,
            posterSlideLink,
            orderNum
        };

        const posterSlideID: number = await this.http.post('/api/admin/posterslides', params);
        return posterSlideID;
    }

    public async modifyPosterSlide(posterSlideID: number, params: ApiTypes.PosterSlideEditableInfo): Promise<boolean> {
        const result: boolean = await this.http.put(`/api/admin/posterslides/${posterSlideID}`, params);
        return result;
    }

    public async deletePosterSlide(posterSlideID: number): Promise<boolean> {
        const params = {};
        const result: boolean = await this.http.delete(`/api/admin/posterslides/${posterSlideID}`, params);
        return result;
    }
}