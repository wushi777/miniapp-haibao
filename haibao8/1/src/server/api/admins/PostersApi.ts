import * as assert      from 'assert';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class PostersApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // poster 操作
        app.get   ('/api/admin/posters',            this.queryPosterPageData);
        app.post  ('/api/admin/posters',            this.createPoster);
        app.put   ('/api/admin/posters/:posterID',  this.modifyPoster);
        app.delete('/api/admin/posters/:posterID',  this.deletePoster);
    }

    private async queryPosterPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterCatIDs:  number[]   = Common.SysUtils.numberArray(req.query.posterCatIDs);
        const startDate:    number      = Common.SysUtils.safeNumber(req.query.startDate);
        const endDate:      number      = Common.SysUtils.safeNumber(req.query.endDate);

        const q:            string      = Common.SysUtils.safeString(req.query.q);
        const sort:         string      = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean     = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number      = Common.SysUtils.safeNumber(req.query.from);
        const count:        number      = Common.SysUtils.safeNumber(req.query.count);

        const result: Utils.ApiTypes.PosterInfoPageData = await db.posters.queryPosterPageData(
            posterCatIDs, startDate, endDate, q, sort, desc, from, count);

        const catsMap: Map<number, Utils.ApiTypes.PosterCatInfo> = new Map();

        for (const item of result.data) {
            item.posterCatNames = [];
            for (const posterCatID of item.posterCatIDs) {
                let catInfo = catsMap.get(posterCatID);
                if (!catInfo) {
                    catInfo = await db.posterCats.getPosterCatInfo(posterCatID);
                    if (catInfo) {
                        catsMap.set(posterCatID, catInfo);
                    }
                }

                if (catInfo) {
                    item.posterCatNames.push(catInfo.posterCatName);
                }
            }
        }

        res.sendData(result);
    }

    private async createPoster(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterCatIDs: number[]    = Common.SysUtils.numberArray(req.body.posterCatIDs);
        const posterName:   string      = Common.SysUtils.safeString(req.body.posterName);
        const posterDesc:   string      = Common.SysUtils.safeString(req.body.posterDesc);
        const posterData:   string      = Common.SysUtils.safeString(req.body.posterData);
        const posterUrl:    string      = Common.SysUtils.safeString(req.body.posterUrl);
        // const thumbUrl:     string      = Common.SysUtils.safeString(req.body.thumbUrl);

        const posterID: number = await db.posters.createPoster(
            posterCatIDs, posterName, posterDesc, posterData, posterUrl /*, thumbUrl*/);

        res.sendData(posterID);
    }

    private async modifyPoster(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterID: number = Common.SysUtils.safeNumber(req.params.posterID);

        const params: Utils.ApiTypes.PosterEditableInfo = {};

        if (req.body.posterCatIDs !== undefined) {
            params.posterCatIDs = Common.SysUtils.numberArray(req.body.posterCatIDs);
        }

        // if (req.body.posterTags !== undefined) {
        //     params.posterTags = Common.SysUtils.numberArray(req.body.posterTags);
        // }

        if (req.body.posterName !== undefined) {
            params.posterName = Common.SysUtils.safeString(req.body.posterName);
        }

        if (req.body.posterDesc !== undefined) {
            params.posterDesc = Common.SysUtils.safeString(req.body.posterDesc);
        }

        if (req.body.posterData !== undefined) {
            params.posterData = Common.SysUtils.safeString(req.body.posterData);
        }

        if (req.body.posterUrl !== undefined) {
            params.posterUrl = Common.SysUtils.safeString(req.body.posterUrl);
        }

        // if (req.body.thumbUrl !== undefined) {
        //     params.thumbUrl = Common.SysUtils.safeString(req.body.thumbUrl);
        // }

        await db.posters.modifyPoster(posterID, params);
        res.sendSuccess();
    }

    private async deletePoster(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const posterID: number = Common.SysUtils.safeNumber(req.params.posterID);

        await db.posters.deletePoster(posterID);
        res.sendSuccess();
    }
}