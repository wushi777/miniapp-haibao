import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class PosterSlidesDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.posterSlidesTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.posterSlideID;
    }

    public async queryPosterSlidePageData(
        q:      string,
        sort:   string,
        desc:   boolean,
        from:   number,
        count:  number
    ): Promise<Utils.ApiTypes.PosterSlidePageData> {
        const filter: any = {};

        if (q) {
            const regExp = Common.StrUtils.makeMongoFindRegExp(q);

            filter.$or = [
                {posterSlideName: regExp},
                {posterSlideDesc: regExp}
            ];
        }

        const total: number = await this.queryCount(filter);
        const data: Utils.ApiTypes.PosterSlideInfo[]  = await this.queryFindEx(filter, sort, desc, from, count);
        
        const result: Utils.ApiTypes.PosterSlidePageData = {
            total,
            data
        };

        return result;
    }

    public async createPosterSlide(
        posterSlideName:    string,
        posterSlideDesc:    string,
        posterSlideUrl:     string,
        posterSlideLink:    string,
        orderNum:           number
    ): Promise<any> {
        const doc: Utils.ApiTypes.PosterSlideInfo = {
            posterSlideID:       0,
            posterSlideName,
            posterSlideDesc,
            posterSlideUrl,
            posterSlideLink,
            orderNum
        };

        const posterSlideID: number = await this.queryInsertOne(doc);
        return posterSlideID;
    }

    public async modifyPosterSlide(
        posterSlideID:  number,
        params:         Utils.ApiTypes.PosterSlideEditableInfo
    ): Promise<void> {
        if (Common.SysUtils.isEmptyObject(params)) {
            return;
        }

        const filter = {
            posterSlideID
        };

        const update = {
            $set: params
        };

        await this.queryUpdate(filter, update);
    }

    public async deletePosterSlide(
        posterSlideID: number
    ): Promise<void> {
        const filter = {
            posterSlideID
        };

        await this.queryDelete(filter);
    }
}
export default new PosterSlidesDB();