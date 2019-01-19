import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class PosterSlidesApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // poster轮播操作
        app.get   ('/api/admin/posterslides',                   this.queryPosterSlidePageData);
        app.post  ('/api/admin/posterslides',                   this.createPosterSlide);
        app.put   ('/api/admin/posterslides/:posterSlideID',    this.modifyPosterSlide);
        app.delete('/api/admin/posterslides/:posterSlideID',    this.deletePosterSlide);
    }

    private async queryPosterSlidePageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const q:        string  = Common.SysUtils.safeString(req.query.q);
        const sort:     string  = Common.SysUtils.safeString(req.query.sort);
        const desc:     boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:     number  = Common.SysUtils.safeNumber(req.query.from);
        const count:    number  = Common.SysUtils.safeNumber(req.query.count);

        const result: Utils.ApiTypes.PosterSlidePageData = await db.posterSlides.queryPosterSlidePageData(
            q, sort, desc, from, count);

        res.sendData(result);
    }

    private async createPosterSlide(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterSlideName:  string = Common.SysUtils.safeString(req.body.posterSlideName);
        const posterSlideDesc:  string = Common.SysUtils.safeString(req.body.posterSlideDesc);
        const posterSlideUrl:   string = Common.SysUtils.safeString(req.body.posterSlideUrl);
        const posterSlideLink:  string = Common.SysUtils.safeString(req.body.posterSlideLink);
        const orderNum:         number = Common.SysUtils.safeNumber(req.body.orderNum);

        const posterSlideID: number = await db.posterSlides.createPosterSlide(
            posterSlideName, posterSlideDesc, posterSlideUrl, posterSlideLink, orderNum);

        res.sendData(posterSlideID);
    }

    private async modifyPosterSlide(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterSlideID: number = Common.SysUtils.safeNumber(req.params.posterSlideID);

        const params: Utils.ApiTypes.PosterSlideEditableInfo = {};

        if (req.body.posterSlideName !== undefined) {
            params.posterSlideName = Common.SysUtils.safeString(req.body.posterSlideName);
        }

        if (req.body.posterSlideDesc !== undefined) {
            params.posterSlideDesc = Common.SysUtils.safeString(req.body.posterSlideDesc);
        }

        if (req.body.posterSlideUrl !== undefined) {
            params.posterSlideUrl = Common.SysUtils.safeString(req.body.posterSlideUrl);
        }

        if (req.body.posterSlideLink !== undefined) {
            params.posterSlideLink = Common.SysUtils.safeString(req.body.posterSlideLink);
        }

        if (req.body.orderNum !== undefined) {
            params.orderNum = Common.SysUtils.safeNumber(req.body.orderNum);
        }

        await db.posterSlides.modifyPosterSlide(posterSlideID, params);
        res.sendSuccess();
    }

    private async deletePosterSlide(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterSlideID: number = Common.SysUtils.safeNumber(req.params.posterSlideID);

        await db.posterSlides.deletePosterSlide(posterSlideID);
        res.sendSuccess();
    }
}