import * as Common  from '../../common';
import * as Utils   from '../../utils';
import * as db      from '../../db';

import * as Base    from '../base';

export class PostersApi extends Base.BaseApi {
    protected setupRouter(app: Base.ExpressApp): void {
        /////////////杂项, 这里的接口不需要传accessToken////////////////////////////////////////////////////////////
        app.get('/api/misc/posters-homedata',   this.queryPosterHomeData);
        app.get('/api/misc/posters-moredata',   this.queryPosterMoreData);
        app.get('/api/misc/posters',            this.queryPosterPageData);
        app.get('/api/misc/posters/:posterID',  this.getPosterInfo);
    }

    private async queryPosterHomeData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const sort:     string  = Common.SysUtils.safeString(req.query.sort);
        const desc:     boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:     number  = Common.SysUtils.safeNumber(req.query.from);
        const count:    number  = Common.SysUtils.safeNumber(req.query.count);

        const slidePageData: Utils.ApiTypes.PosterSlidePageData = await db.posterSlides.queryPosterSlidePageData(
            '', Utils.ApiTypes.OrderNumFieldName, false, 0, 0);
            
        const catPageData: Utils.ApiTypes.PosterCatPageData = await db.posterCats.queryPosterCatPageData(
            '', Utils.ApiTypes.OrderNumFieldName, false, 0, 0);

        for (const item of catPageData.data) {
            item.posters = await db.posters.queryPosterPageData(
                [item.posterCatID], 0, 0, '', sort, desc, from, count);
        }

        const result: Utils.ApiTypes.PosterHomeData = {
            slides: slidePageData.data,
            cats:   catPageData.data
        };

        res.sendData(result);
    }

    private async queryPosterMoreData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const posterCatID:  number  = Common.SysUtils.safeNumber(req.query.posterCatID);
        const sort:         string  = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number  = Common.SysUtils.safeNumber(req.query.from);
        const count:        number  = Common.SysUtils.safeNumber(req.query.count);

        const catPageData: Utils.ApiTypes.PosterCatPageData = await db.posterCats.queryPosterCatPageData(
            '', Utils.ApiTypes.OrderNumFieldName, false, 0, 0);

        for (const item of catPageData.data) {
            if (item.posterCatID === posterCatID) {
                item.posters = await db.posters.queryPosterPageData(
                    [posterCatID], 0, 0, '', sort, desc, from, count);
            }
        }

        const result: Utils.ApiTypes.PosterMoreData = {
            cats:   catPageData.data
        };

        res.sendData(result);
    }

    private async queryPosterPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const posterCatID:  number      = Common.SysUtils.safeNumber(req.query.posterCatID);
        const q:            string      = Common.SysUtils.safeString(req.query.q);
        const sort:         string      = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean     = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number      = Common.SysUtils.safeNumber(req.query.from);
        const count:        number      = Common.SysUtils.safeNumber(req.query.count);
        const startDate:    number      = Common.SysUtils.safeNumber(req.query.startDate);
        const endDate:      number      = Common.SysUtils.safeNumber(req.query.endDate);

        const data: Utils.ApiTypes.PosterInfoPageData = await db.posters.queryPosterPageData(
            [posterCatID], startDate, endDate, q, sort, desc, from, count);

        res.sendData(data);
    }

    private async getPosterInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const posterID:         number  = Common.SysUtils.safeNumber(req.params.posterID);
        const updateViewTimes:  boolean = Common.SysUtils.safeBoolean(req.query.updateViewTimes);

        const info: Utils.ApiTypes.PosterInfo = await db.posters.getPosterInfo(posterID, updateViewTimes);
        res.sendData(info);
    }
}
