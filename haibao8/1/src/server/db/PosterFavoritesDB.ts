import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

import * as Utils   from '../utils';
import * as Common  from '../common';

import postersDB    from './PostersDB';

export class PosterFavoritesDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.posterFavoritesTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.posterFavoriteID;
    }

    public async queryPosterFavoritePageData(
        accountID:  number,
        sort:       string,
        desc:       boolean,
        from:       number,
        count:      number
    ): Promise<Utils.ApiTypes.PosterFavoritePageData> {
        const filter: any = {
            accountID
        };

        const total: number = await this.queryCount(filter);

        const data: Utils.ApiTypes.PosterFavoriteInfo[] = await this.queryFindEx(
            filter, sort, desc, from, count);

        const result: Utils.ApiTypes.PosterFavoritePageData = {
            total,
            data
        };

        for (const item of result.data) {
            item.posterInfo = await postersDB.getPosterInfo(item.posterID, false);
        }

        return result;
    }

    public async getPosterFavoriteInfo(
        accountID:  number,
        posterID:   number
    ): Promise<Utils.ApiTypes.PosterFavoriteInfo> {
        const filter = {
            accountID,
            posterID
        };

        const info: Utils.ApiTypes.PosterFavoriteInfo = await this.queryFindOne(filter);
        return info;
    }

    public async upsertPoster(
        accountID:  number,
        posterID:   number
    ): Promise<void> {
        const filter = {
            accountID,
            posterID
        };

        const update = {
            favoriteDate: Common.DateUtils.now()
        };

        await this.queryUpsertOne(filter, update);
        
        // const posterFavoriteInfo: Utils.ApiTypes.PosterFavoriteInfo = await this.getPosterFavoriteInfo(accountID, posterID);

        // const favoriteDate: number = Common.DateUtils.now();

        // if (posterFavoriteInfo) {
        //     const filter = {
        //         posterFavoriteID: posterFavoriteInfo.posterFavoriteID
        //     };

        //     const update = {
        //         $set: {
        //             favoriteDate
        //         }
        //     };

        //     await this.queryUpdate(filter, update);
        // } else {
        //     const doc: Utils.ApiTypes.PosterFavoriteInfo = {
        //         posterFavoriteID: 0,
        //         accountID,
        //         posterID,
        //         favoriteDate
        //     };

        //     await this.queryInsertOne(doc);
        // }
    }

    public async removePoster(
        accountID:  number,
        posterID:   number
    ): Promise<void> {
        const filter = {
            accountID,
            posterID
        };

        await this.queryDelete(filter);
    }
}

export default new PosterFavoritesDB();