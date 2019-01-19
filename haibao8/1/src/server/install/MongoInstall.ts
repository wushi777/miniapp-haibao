import * as Utils           from '../utils';
 
import { mongoDriver }      from '../db/driver/MongoDriver';
import { MongoConnection }  from '../db/driver/MongoDriver';
import { DBConsts }         from '../db/DBConsts';

import * as db              from '../db';


export default class MongoInstall {
    //创建一个管理员用户 password 传过来的是 md5 后的
    private async createAdmin(adminName: string, password: string): Promise<void> 
    {
        const adminInfo: Utils.ApiTypes.AdminInfo = await db.admins.getAdminInfoByAdminName(adminName);
        if (adminInfo) {
            return;
        }

        await db.admins.createAdmin(adminName, password);
        return;
    }

    private async createAllIndexes(conn: MongoConnection): Promise<void> {
        let coll;

        coll = mongoDriver.getMongoCollection(DBConsts.tables.tokensTable, conn);
        await coll.createIndex({ID: 1});

        coll = mongoDriver.getMongoCollection(DBConsts.tables.adminsTable, conn);
        await coll.createIndex({ID: 1});
        await coll.createIndex({adminName: 1});

        coll = mongoDriver.getMongoCollection(DBConsts.tables.accountsTable, conn);
        await coll.createIndex({ID: 1});
        await coll.createIndex({openid: 1});

        coll = mongoDriver.getMongoCollection(DBConsts.tables.settingsTable, conn);
        await coll.createIndex({ID: 1});
        await coll.createIndex({name: 1});

        coll = mongoDriver.getMongoCollection(DBConsts.tables.posterCatsTable, conn);
        await coll.createIndex({ID: 1});
        await coll.createIndex({posterCatName: 1});

        coll = mongoDriver.getMongoCollection(DBConsts.tables.posterSlidesTable, conn);
        await coll.createIndex({ID: 1});
        await coll.createIndex({posterSlideName: 1});

        coll = mongoDriver.getMongoCollection(DBConsts.tables.postersTable, conn);
        await coll.createIndex({ID: 1});

        coll = mongoDriver.getMongoCollection(DBConsts.tables.shopSlidesTable, conn);
        await coll.createIndex({ID: 1});
        await coll.createIndex({shopSlideName: 1});

        coll = mongoDriver.getMongoCollection(DBConsts.tables.shopCatsTable, conn);
        await coll.createIndex({ID: 1});

        coll = mongoDriver.getMongoCollection(DBConsts.tables.shopsTable, conn);
        await coll.createIndex({ID: 1});
    }

    public async execute(
        mongoInfo:  Utils.ApiTypes.MongoInfo, 
        adminName:  string, 
        password:   string, 
        clearAll:   boolean
    ): Promise<void> {
        let mongoConn: MongoConnection;
        try {
            mongoConn = await mongoDriver.createMongoConnection(mongoInfo);
            if (clearAll) {
                //清空Mongo数据库
                const tables: any[] = await mongoConn.db.collections();
                for (const item of tables) {
                    if (item.collectionName.indexOf(mongoInfo.tablePrefix) === 0) {
                        await mongoConn.db.dropCollection(item.collectionName);
                    }
                }
            }

            await this.createAdmin(adminName, password);

            await this.createAllIndexes(mongoConn);
        } finally {
            if (mongoConn){
                mongoConn.dispose();
            }
        }
    }
}