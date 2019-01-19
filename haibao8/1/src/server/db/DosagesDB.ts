import * as Utils   from '../utils';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class DosagesDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.dosagesTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.dosageID
    }

    //获取消费记录列表
    public async queryDosagePageData(
        accountID:  number, 
        startDate:  number, 
        endDate:    number, 
        sort:       string, 
        desc:       boolean, 
        from:       number, 
        count:      number
    ): Promise<Utils.ApiTypes.DosageInfoPageData> {
        const filter: any = {};

        if(accountID) {
            filter.accountID = accountID;
        }

        if (startDate || endDate) {
            filter.startDate = {};
            if (startDate) {
                filter.startDate['$gte']   = startDate;
            }

            if (endDate) {
                filter.startDate['$lte']   = endDate;
            }
        }

        const total:    number = await this.queryCount(filter);
        const data:     Utils.ApiTypes.DosageInfo[]  = await this.queryFindEx(filter, sort, desc, from, count);

        const result: Utils.ApiTypes.DosageInfoPageData = {
            total,
            data
        };

        return result;
    }

    //创建一条消费记录
    public async createDosage(
        accountID:      number,
        startDate:      number,
        endDate:        number, 
        minutes:        number, 
        incByFen:       number
    ): Promise<any> {
        const startDateObj: Date = new Date(startDate);
        const endDateObj:   Date = new Date(endDate);

        const doc: Utils.ApiTypes.DosageInfo = {
            dosageID:       0,
            accountID:      accountID, 
            startDate:      startDate,
            startDateObj:   startDateObj,
            endDate, 
            endDateObj,
            minutes, 
            incByFen
        };

        const dosageID: number = await this.queryInsertOne(doc);
        return dosageID;
    }
}
export default new DosagesDB();