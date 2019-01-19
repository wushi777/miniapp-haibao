import * as Common  from '../common';
import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class MyPostersDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.myPostersTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.myPosterID;
    }

    public async queryMyPosterPageData(
		accountID: 		number,
        startDate:      number,
        endDate:        number,

        q:              string,
        sort:           string, 
        desc:           boolean, 
        from:           number, 
        count:          number
    ): Promise<Utils.ApiTypes.MyPosterInfoPageData> {
		const filter: any = {};
		
		if (accountID) {
			filter.accountID = accountID;
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
                {myPosterName: regExp},
                {myPosterDesc: regExp}
            ];
        }

        const total:    number = await this.queryCount(filter);
        const data:     Utils.ApiTypes.MyPosterInfo[]  = await this.queryFindEx(filter, sort, desc, from, count);

        const result: Utils.ApiTypes.MyPosterInfoPageData = {
            total,
            data
        };

        return result;
    }

    public async getMyPosterInfo(
		accountID: 	number,
        myPosterID: number
    ): Promise<Utils.ApiTypes.MyPosterInfo> {
        const filter: any = {
            myPosterID
		};
		
		if (accountID) {
			filter.accountID = accountID;
		}

        const info: Utils.ApiTypes.MyPosterInfo = await this.queryFindOne(filter);
        return info;
    }

    public async createMyPoster(
		accountID:			number,
        myPosterName:		string,
		myPosterDesc:		string,
		myPosterUrl:		string,
		posterID:			number   
    ): Promise<number> {
        const createDate:       number = Common.DateUtils.now();
        const createDateObj:    Date    = new Date(createDate);

        const doc: Utils.ApiTypes.MyPosterInfo = {
            myPosterID:       0,
			
			accountID,
			posterID,

            myPosterName,
			myPosterDesc,
			myPosterUrl,
			
            createDate,
            createDateObj
        };

        const myPosterID: number = await this.queryInsertOne(doc);
        return myPosterID;
    }

    public async modifyMyPoster(
        accountID:  number,
        myPosterID: number,
        params:     Utils.ApiTypes.MyPosterEditableInfo
    ): Promise<void> {
        if (Common.SysUtils.isEmptyObject(params)) {
            return;
        }

        const filter: any = {
            myPosterID
        };

        if (accountID) {
            filter.accountID = accountID;
        }

        const update = {
            $set: params
        };

        await this.queryUpdate(filter, update);
    }

    public async deleteMyPoster(
        accountID:  number,
        myPosterID: number
    ): Promise<void> {
        const filter: any = {
            myPosterID
        };

        if (accountID) {
            filter.accountID = accountID;
        }

        await this.queryDelete(filter);
    }
}
export default new MyPostersDB();