import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class PostersDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.postersTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.posterID;
    }

    public async queryPosterPageData(
        posterCatIDs:   number[],
        startDate:      number,
        endDate:        number,

        q:              string,
        sort:           string, 
        desc:           boolean, 
        from:           number, 
        count:          number
    ): Promise<Utils.ApiTypes.PosterInfoPageData> {
        const filter: any = {};

        if (posterCatIDs.length > 0) {
            filter.posterCatIDs = {
                $all: posterCatIDs
            }
        }

        if (startDate || endDate) {
            filter.createDate = {};
            if (startDate) {
                filter.createDate['$gte']   = startDate;
            }

            if (endDate) {
                filter.createDate['$lte']   = endDate;
            }
        }

        if (q) {
            const regExp = Common.StrUtils.makeMongoFindRegExp(q);

            filter.$or = [
                {posterName: regExp},
                {posterDesc: regExp}
            ];
        }

        const total:    number = await this.queryCount(filter);
        const data:     Utils.ApiTypes.PosterInfo[]  = await this.queryFindEx(filter, sort, desc, from, count);

        const result: Utils.ApiTypes.PosterInfoPageData = {
            total,
            data
        };

        return result;
    }

    public async getPosterInfo(
        posterID:           number,
        updateViewTimes:    boolean
    ): Promise<Utils.ApiTypes.PosterInfo> {
        const filter = {
            posterID
        };

        if (updateViewTimes) {
            const update = {
                $inc: {
                    viewTimes: 1
                }
            };

            await this.queryUpdate(filter, update);
        }

        const info: Utils.ApiTypes.PosterInfo = await this.queryFindOne(filter);
        return info;
    }

    public async createPoster(
        posterCatIDs:   number[],
        posterName:     string,
        posterDesc:     string,
        posterData:     string,
        posterUrl:      string,
        // thumbUrl:       string        
    ): Promise<number> {
        const createDate:       number = Common.DateUtils.now();
        const createDateObj:    Date    = new Date(createDate);

        const doc: Utils.ApiTypes.PosterInfo = {
            posterID:       0,
            
            posterName,
            posterDesc,
            posterData,
            posterUrl,
            // thumbUrl,
            posterCatIDs,

            viewTimes:      0,

            createDate,
            createDateObj
        };

        const posterID: number = await this.queryInsertOne(doc);
        return posterID;
    }

    public async modifyPoster(
        posterID:   number,
        params:     Utils.ApiTypes.PosterEditableInfo
    ): Promise<void> {
        if (Common.SysUtils.isEmptyObject(params)) {
            return;
        }

        const filter = {
            posterID
        };

        const update = {
            $set: params
        };

        await this.queryUpdate(filter, update);
    }

    public async deletePoster(
        posterID: number
    ): Promise<void> {
        const filter = {
            posterID
        };

        await this.queryDelete(filter);
    }
}
export default new PostersDB();