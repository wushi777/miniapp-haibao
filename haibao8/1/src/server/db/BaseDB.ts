import * as Utils       from '../utils';

import { BaseDriver }   from './driver/BaseDriver';
import { mongoDriver }  from './driver/MongoDriver';


export class BaseDB {
    protected get tableName(): string {
        return '';
    }

    protected get docKey(): string {
        return '';
    }

    public get fullTableName(): string {
        // let prefix: string = '';
        // switch (Utils.configStore.dbInfo.dbtype) {
        //     case 'mongo':
        //         prefix = Utils.configStore.dbInfo.mongo.tablePrefix;
        //         break;

        //     default:
        //         break;
        // }
        const prefix: string = Utils.configs.dbInfo.mongo.tablePrefix;

        const fullTableName: string = prefix + this.tableName;
        return fullTableName;
    }

    public get driver(): BaseDriver {
        // switch (Utils.configStore.dbInfo.dbtype) {
        //     case 'mongo':
        //         return mongoDriver;
                
        //     default:
        //         return null;
        // }
        return mongoDriver;
    }

    private fixFilter(filter: any): void {
        const driver: BaseDriver = this.driver;

        if (typeof filter !== 'object') {
            return;
        }

        if ((this.docKey) && (driver.primaryKey)) {
            for (const key of Object.keys(filter)) {
                if (key === this.docKey){
                    filter[driver.primaryKey] = filter[key];
                    delete filter[key];
                }
            }
        }
        
        /*
        for (const key of Object.keys(filter)){
            if (key === this.docKey){
                filter[driver.primaryKey] = filter[key];
                delete filter[key];
            }
        }
        */
    }

    public async forceField(fieldName: string, fieldType: string): Promise<void> {
        await this.driver.forceField(this.fullTableName, fieldName, fieldType);
    }

    public async queryCount(filter: any): Promise<number> {
        this.fixFilter(filter);
        const count: number = await this.driver.count(this.fullTableName, filter);
        return count;
    }

    public async queryFind(filter: any): Promise<Array<any>> 
    {
        const driver = this.driver;

        this.fixFilter(filter);

        const rows: any[] = await driver.find(this.fullTableName, filter);

        if ((this.docKey) && (driver.primaryKey)) {
            rows.forEach((item) => {
                item[this.docKey] = item[driver.primaryKey];
                delete item[driver.primaryKey];
            });
        }

        /*
        for (const item of rows){
            item[this.docKey] = item[driver.primaryKey];
            delete item[driver.primaryKey];
        }
        */

        return rows;   
    }

    public async queryFindEx(filter: any, sort: string, desc: boolean, 
        from: number, count: number): Promise<any[]> 
    {
        const driver = this.driver;

        this.fixFilter(filter);

        if (sort === this.docKey) {
            sort = driver.primaryKey;
        }

        const rows: any[] = await driver.findEx(this.fullTableName, filter, sort, desc, from, count);

        if ((this.docKey) && (driver.primaryKey)) {
            rows.forEach((item) => {
                item[this.docKey] = item[driver.primaryKey];
                delete item[driver.primaryKey];
            });
        }

        /*
        for (const item of rows){
            item[this.docKey] = item[driver.primaryKey];
            delete item[driver.primaryKey];
        }
        */

        return rows;   
    }

    public async queryFindOne(filter: any): Promise<any> {
        const driver = this.driver;

        this.fixFilter(filter);

        const info: any = await driver.findOne(this.fullTableName, filter);

        if (info){
            if ((this.docKey) && (driver.primaryKey)) {
                info[this.docKey] = info[driver.primaryKey];
                delete info[driver.primaryKey];
            }
        }

        return info;
    }

    public async queryInsertOne(doc: any): Promise<number> {
        if (this.docKey) {
            delete doc[this.docKey];
        }

        this.fixFilter(doc);
        const ID: number = await this.driver.insertOne(this.fullTableName, doc);
        return ID;
    }

    public async queryUpsertOne(filter: any, update: any): Promise<void> {
        this.fixFilter(filter);

        if (this.docKey) {
            delete update[this.docKey];
        }

        this.fixFilter(update['$set']);
        this.fixFilter(update['$addToSet']);
        this.fixFilter(update['$pull']);

        await this.driver.upsertOne(this.fullTableName, filter, update);
    }

    public async queryUpdate(filter: any, update: any): Promise<void> {
        this.fixFilter(filter);

        if (this.docKey) {
            delete update[this.docKey];
        }

        this.fixFilter(update['$set']);
        this.fixFilter(update['$addToSet']);
        this.fixFilter(update['$pull']);
        
        await this.driver.update(this.fullTableName, filter, update);
    }

    public async queryDelete(filter: any): Promise<void> {
        this.fixFilter(filter);
        await this.driver.delete(this.fullTableName, filter);
    }

    public async queryAggregate(pipeline: any): Promise<Array<any>> {
        const driver: BaseDriver = this.driver;

        const rows: any[] = await driver.aggregate(this.fullTableName, pipeline);

        if ((this.docKey) && (driver.primaryKey)) {
            rows.forEach((item) => {
                item[this.docKey] = item[driver.primaryKey];
                delete item[driver.primaryKey];
            });
        }

        return rows;
    }
}