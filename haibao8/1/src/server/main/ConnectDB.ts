import * as fs          from 'fs';

import * as Common      from '../common';
import * as Utils       from '../utils';

import { mongoDriver }  from '../db/driver/MongoDriver';


class ConnectDB {
    public async tryConnectDatabases(): Promise<void> {
        if (!Utils.configs.dbInfo.inited) {
            Common.logger.warn(Utils.MyTypes.logCats.Other, '尚未安装!!!!!');
            return;
        }

        //连接 MongoDB 数据库
        const mongoInfo: Utils.ApiTypes.MongoInfo = Utils.configs.dbInfo.mongo;
        await mongoDriver.tryConnectMongoServer(mongoInfo);
    }
}

export const connectDB = new ConnectDB();