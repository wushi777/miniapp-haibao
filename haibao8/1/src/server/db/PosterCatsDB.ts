import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class PosterCatsDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.posterCatsTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.posterCatID;
    }

    public async queryPosterCatPageData(
        q:      string,
        sort:   string,
        desc:   boolean,
        from:   number,
        count:  number
    ): Promise<Utils.ApiTypes.PosterCatPageData> {
        const filter: any = {};

        if (q) {
            const regExp = Common.StrUtils.makeMongoFindRegExp(q);

            filter.$or = [
                {posterCatName: regExp},
                {posterCatDesc: regExp}
            ];
        }

        const total: number = await this.queryCount(filter);
        const data: Utils.ApiTypes.PosterCatInfo[] = await this.queryFindEx(filter, sort, desc, from, count);

        const result: Utils.ApiTypes.PosterCatPageData = {
            total,
            data
        };
        
        return result;
    }

    public async getPosterCatInfo(posterCatID: number): Promise<Utils.ApiTypes.PosterCatInfo> {
        const filter = {
            posterCatID
        };

        const info: Utils.ApiTypes.PosterCatInfo = await this.queryFindOne(filter);
        return info;
    }

    public async getPosterCatByName(posterCatName: string): Promise<Utils.ApiTypes.PosterCatInfo> {
        const filter = {
            posterCatName
        };

        const info: Utils.ApiTypes.PosterCatInfo = await this.queryFindOne(filter);
        return info;
    }

    public async createPosterCat(
        posterCatName:  string,
        posterCatDesc:  string,
        hotspot:        boolean,
        orderNum:       number
    ): Promise<number> {
        const info: Utils.ApiTypes.PosterCatInfo = await this.getPosterCatByName(posterCatName);
        if (info) {
            const error = new Error('分类名称已存在, 创建失败');
            throw error;
        }

        const doc: Utils.ApiTypes.PosterCatInfo = {
            posterCatID:       0,
            posterCatName,
            posterCatDesc,
            hotspot,
            orderNum
        };

        const posterCatID: number = await this.queryInsertOne(doc);
        return posterCatID;
    }

    public async modifyPosterCat(
        posterCatID:    number,
        params:         Utils.ApiTypes.PosterCatEditableInfo
    ): Promise<void> {
        if (Common.SysUtils.isEmptyObject(params)) {
            return;
        }

        if (params.posterCatName !== undefined) {
            const info: Utils.ApiTypes.PosterCatInfo = await this.getPosterCatByName(params.posterCatName);
            if (info && (info.posterCatID !== posterCatID)) {
                const error = new Error('分类名称已存在, 创建失败');
                throw error;
            }
        }

        const filter = {
            posterCatID
        };

        const update = {
            $set: params
        };

        await this.queryUpdate(filter, update);
    }

    public async deletePosterCat(
        posterCatID: number
    ): Promise<void> {
        const filter = {
            posterCatID
        };

        await this.queryDelete(filter);
    }
}
export default new PosterCatsDB();