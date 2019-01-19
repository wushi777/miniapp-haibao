import * as MongoDB     from 'mongodb';

import { BaseDriver }   from './BaseDriver';
 
import * as Common      from '../../common';
import * as Utils       from '../../utils';


export class MongoConnection {
    private _db: MongoDB.Db = null;

    constructor(
        private mongoInfo:  Utils.ApiTypes.MongoInfo,
        private client:     MongoDB.MongoClient
    ){};

    dispose(){
        if (this.client){
            this.client.close();
            this.client = null;
        }

        this._db = null;
    }

    get db(): MongoDB.Db {
        if (!this._db) {
            this._db = this.client.db(this.mongoInfo.database);
        }
        return this._db;
    }

    getCollection(fullTableName: string): MongoDB.Collection {
        const coll: MongoDB.Collection = this.db.collection(fullTableName);
        return coll;
    }

    public async getNextSequenceID(tableName: string): Promise<number> {
        const collectionName: string    = this.mongoInfo.tablePrefix + 'counters';
        const coll: MongoDB.Collection  = this.db.collection(collectionName);

        //创建 counterName 索引
        await coll.createIndex({counterName: 1});
        
        const filter = {
            counterName: tableName
        };

        const update = {
            $inc: {
                counterValue: 1
            }
        };

        const options = {
            upsert: true,
            returnOriginal: false
        }

        const info: any = await coll.findOneAndUpdate(filter, update, options);
        return info.value.counterValue;
    }

    public async fixCounter(tableName: string, counterValue: number): Promise<void> {
        const collectionName:   string              = this.mongoInfo.tablePrefix + 'counters';
        const coll:             MongoDB.Collection  = this.db.collection(collectionName);

        const filter = {
            counterName: tableName
        };

        const info: any = await coll.findOne(filter);
        if (info){
            if (counterValue > info.value.counterValue) {
                const update = {
                    counterValue
                };
                await coll.updateOne(filter, update);
            }
        } else {
            const doc = {
                counterName: tableName,
                counterValue
            };

            await coll.insertOne(doc);
        }
    }
}

export class MongoDriver extends BaseDriver {
    private mongoConn: MongoConnection = null;

    constructor(){
        super();
    }

    get db(): MongoDB.Db {
        return this.mongoConn.db;
    }

    public getCollection(tableName: string): MongoDB.Collection {
        const collection: MongoDB.Collection = this.mongoConn.db.collection(tableName);
        return collection;
    }

    /*
    public fixFilter(filter: any): void {
        for (const key of Object.keys(filter)){
            if (key === this.primaryKey){
                filter[key] = MongoDB.ObjectID.createFromHexString(filter[key]);
            }
        }
    }
    */

    public async count(tableName: string, filter: any): Promise<number> {
        //this.fixFilter(filter);
        const collection: MongoDB.Collection = this.getCollection(tableName);
        const count: number = await collection.count(filter, {});
        return count;
    }

    public async find(tableName: string, filter: any): Promise<any[]> {
        const collection: MongoDB.Collection = this.getCollection(tableName);

        const docs: any[] = await collection.find(filter).toArray();

        docs.forEach((item) => delete item._id);

        /*
        for (const items of docs) {
            delete items._id;
        }
        */

        return docs;
    }

    public async findEx(
        tableName:  string, 
        filter:     any, 
        sort:       string, 
        desc:       boolean, 
        from:       number, 
        count:      number
    ): Promise<any[]> {
        const collection: MongoDB.Collection = this.getCollection(tableName);

        let cursor: MongoDB.Cursor = collection.find(filter);

        if (sort) {
            const direction: number = desc ? -1 : 1;
            cursor = cursor.sort({[sort]: direction});
        }

        if (from > 0) {
            cursor = cursor.skip(from);
        }

        if (count > 0) {
            cursor = cursor.limit(count);
        }

        const docs: any[] = await cursor.toArray();

        docs.forEach((item) => delete item._id);

        /*
        for (const items of docs) {
            delete items._id;
        }
        */

        return docs;
    }

    public async findOne(tableName: string, filter: any): Promise<any> {
        const collection: MongoDB.Collection = this.getCollection(tableName);
        const doc: any = await collection.findOne(filter);

        if (doc){
            delete doc._id;
        }
        
        return doc;
    }

    public async upsertOne(tableName: string, filter: any, update: any): Promise<void> {
        const collection: MongoDB.Collection = this.getCollection(tableName);

        const options = {
            upsert: true
        };

        const newUpdate = {
            $set: {
                ...filter,
                ...update
            }
        };

        await collection.updateOne(filter, newUpdate, options);
    }

    public async insertOne(tableName: string, doc: any): Promise<number> {
        const collection: MongoDB.Collection = this.getCollection(tableName);

        let ID: number = 0;
        if (this.primaryKey){
            ID = await this.mongoConn.getNextSequenceID(tableName);
            doc[this.primaryKey] = ID;
        }

        const result: MongoDB.InsertOneWriteOpResult = await collection.insertOne(doc);
        return ID;
    }

    public async update(tableName: string, filter: any, update: any): Promise<void> {
        const collection: MongoDB.Collection = this.getCollection(tableName);
        await collection.updateMany(filter, update);
    }

    public async delete(tableName: string, filter: any): Promise<void> {
        const collection: MongoDB.Collection = this.getCollection(tableName);
        await collection.deleteMany(filter);
    }
    
    public async aggregate(tableName: string, pipeline: any): Promise<any> {
        const collection: MongoDB.Collection = this.getCollection(tableName);
        const rows: any = collection.aggregate(pipeline).toArray();
        return rows;
    }

    //创建一个Mongo的连接
    public async createMongoConnection(mongoInfo: Utils.ApiTypes.MongoInfo): Promise<MongoConnection> {
        if (!mongoInfo.host) {
            const error = new Error('尚未配置MongoDB数据库');
            throw error;
        }

        const mongoURI:   string = `mongodb://${mongoInfo.host}:${mongoInfo.port}`;

        const options:    MongoDB.MongoClientOptions = {
            poolSize:           10,
            autoReconnect:      true,
            reconnectTries:     100000,
            reconnectInterval:  3000,
            useNewUrlParser:    true,
        };

        if (mongoInfo.user && mongoInfo.password) {
            options.auth = {
                user:       mongoInfo.user,
                password:   mongoInfo.password
            };

            options.authSource = 'admin';
        }
        
        Common.logger.log(Utils.MyTypes.logCats.Other, '正在尝试连接 MongoDB 数据库:', mongoURI);
        try{
            const client: MongoDB.MongoClient   = await MongoDB.MongoClient.connect(mongoURI, options);
            client.db(mongoInfo.database);

            const conn: MongoConnection = new MongoConnection(mongoInfo, client);

            Common.logger.log(Utils.MyTypes.logCats.Other, 'MongoDB 数据库连接成功.');
            return conn;
        } catch (err) {
            err.message = `连接 MongoDB 数据库失败: ${err.message}`;
            Common.logger.error(err);
            throw err;
        }
    }

    //连接 MongoDB 数据库
    public async tryConnectMongoServer(mongoInfo: Utils.ApiTypes.MongoInfo): Promise<void> {
        if (this.mongoConn) {
            return;
        }

        try {
            //logger.log(logCats.Other, `正在尝试连接 MongoDB (${mongoInfo.host}:${mongoInfo.port})......`);

            this.mongoConn = await this.createMongoConnection(mongoInfo);

            //logger.log(logCats.Other, '连接 MongoDB 成功');
        } catch (err) {
            Common.logger.error('连接 MongoDB 失败: ', err);
            throw err;
        }
    }

    public async disconnectServer(): Promise<void> {
        if (this.mongoConn){
            this.mongoConn.dispose();
            this.mongoConn = null;
        }
    }

    public getMongoCollection(collectionName: string, mongoConnection: MongoConnection = null): MongoDB.Collection {
        //const nameWithPrefix    = this.mongoInfo.tablePrefix + collectionName;
        const nameWithPrefix: string = Utils.configs.dbInfo.mongo.tablePrefix + collectionName;

        let conn = mongoConnection;
        if (!conn){
            conn = this.mongoConn;
        }

        const collection: MongoDB.Collection = conn.db.collection(nameWithPrefix);
        return collection;
    }
}

export const mongoDriver = new MongoDriver();