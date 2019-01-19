import * as assert          from 'assert';

import * as Common          from '../../common';
import * as Utils           from '../../utils';
import * as db              from '../../db';

import * as Base            from '../base';
import { BaseAccountApi }   from './BaseAccountApi';

export class PosterFavoritesApi extends BaseAccountApi {
    protected setupRouter(app: Base.ExpressApp): void {
        //海报收藏操作
        app.post('/api/account/posterfavorites',                this.addPosterToFavorite);
        app.get('/api/account/posterfavorites',                 this.queryPosterFavoritePageData);
        app.get('/api/account/posterfavorites/:posterID',       this.getPosterFavoriteInfo);
        app.delete('/api/account/posterfavorites/:posterID',    this.removePosterFromFavorite);
    }

    private async addPosterToFavorite(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const posterID: number = Common.SysUtils.safeNumber(req.body.posterID);

        await db.posterFavorites.upsertPoster(token.accountID, posterID);

        res.sendSuccess();
    }

    private async removePosterFromFavorite(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const posterID: number = Common.SysUtils.safeNumber(req.params.posterID);

        await db.posterFavorites.removePoster(token.accountID, posterID);
        res.sendSuccess();
    }

    private async queryPosterFavoritePageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const sort:         string  = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number  = Common.SysUtils.safeNumber(req.query.from);
        const count:        number  = Common.SysUtils.safeNumber(req.query.count);

        const data: Utils.ApiTypes.PosterFavoritePageData = await db.posterFavorites.queryPosterFavoritePageData(
            token.accountID, sort, desc, from, count);
        
        res.sendData(data);
    }

    private async getPosterFavoriteInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const posterID: number = Common.SysUtils.safeNumber(req.params.posterID);

        const info: Utils.ApiTypes.PosterFavoriteInfo = await db.posterFavorites.getPosterFavoriteInfo(
            token.accountID, posterID);

        res.sendData(info);
    }
}
