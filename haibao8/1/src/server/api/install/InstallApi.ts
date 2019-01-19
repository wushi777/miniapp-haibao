import * as url         from 'url';
 
import * as Common      from '../../common';
import * as Install     from '../../install';
import * as Utils       from '../../utils';
import * as Main        from '../../main';

import * as Base        from '../base';

import { mongoDriver }  from '../../db/driver/MongoDriver';

export class InstallApi extends Base.BaseApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // 检查是否已安装
        app.get('/api/install/check',   this.checkInstalled);

        // 全新安装
        app.post('/api/install/new',    this.newInstall);

        // 添加到集群
        app.post('/api/install/addto',  this.addToCluster);
    }

    // GET 检查是否已安装
    public async checkInstalled(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const data = Utils.configs.dbInfo.inited;
        res.sendData(data);
    }

    // POST 全新安装
    public async newInstall(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        if (Utils.configs.dbInfo.inited){
            const error = new Error('数据库已经配置并初始化了');
            throw error;
        }

        const clearAll:     boolean = Common.SysUtils.safeBoolean(req.body.clearAll);
        const adminName:    string  = Common.SysUtils.safeString(req.body.adminName); 
        const password:     string  = Common.SysUtils.safeString(req.body.password); //admin 中的 password 传过来的是明文

        this.fixPrefixes(req);

        Utils.configs.dbInfo.mongo  = req.body.mongo;

        // 断开数据库连接`
        await mongoDriver.disconnectServer();

        if (Utils.configs.dbInfo.mongo) {
            //连接数据库
            await mongoDriver.tryConnectMongoServer(Utils.configs.dbInfo.mongo);
            //Utils.configs.dbInfo.dbtype = 'mongo';

            //安装数据库
            const mongoInstall = new Install.MongoInstall();
            await mongoInstall.execute(Utils.configs.dbInfo.mongo, adminName, password, clearAll);
        } else {
            const error = new Error('没有 mongo 信息');
            throw error;
        }

        await this.writeDBInfoToConfigFile(); //该函数里会调用 init();

        res.sendSuccess();
    }

    //POST 添加到集群:
    public async addToCluster(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const serverUrl:    string = Common.SysUtils.safeString(req.body.serverUrl);
        const adminName:    string = Common.SysUtils.safeString(req.body.adminName);
        const password:     string = Common.SysUtils.safeString(req.body.password);

        const urlObject:    url.UrlWithStringQuery = url.parse(serverUrl);
        const rootUrl:      string  = `${urlObject.protocol}//${urlObject.hostname}:${urlObject.port}`;

        let params;
        let response;

        params = {
            adminName,
            password
        };

        response = await Common.JsonHttp.post(rootUrl + '/api/admin/login', params);

        if (response.error) {
            throw response.error;
        }

        const result: any = response.result;

        params = {
            accessToken: result.accessToken
        };

        response = await Common.JsonHttp.get(rootUrl + '/api/admin/settings/dbinfo', params);

        if (response.error) {
            throw response.error;
        }

        const data: any = response.result;

        Utils.configs.dbInfo = data;
        await Utils.configs.saveDbInfo();

        try{
            await Main.connectDB.tryConnectDatabases();
        }catch(error){
            Utils.configs.dbInfo.inited = false;
            await Utils.configs.saveDbInfo();
            throw error;
        }

        res.sendSuccess();
    }

    private async writeDBInfoToConfigFile(): Promise<void> {
        try{
            Utils.configs.dbInfo.inited = true;

            await Utils.configs.saveDbInfo();//保存连接信息到配置文件
            await mongoDriver.disconnectServer();

            await Main.connectDB.tryConnectDatabases();
        }catch(error){
            Utils.configs.dbInfo.inited = false;
            throw error;
        }
    }

    private checkOrAppendUnderline(S: string): string {
        if (S) {
            const ch = S.charAt(S.length - 1);
            if (ch !== '_') {
                S += '_';
            }
        }

        return S;
    }

    private fixPrefixes(req): void {
        if (req.body.mongo) {
            const prefix: string = req.body.mongo.tablePrefix;
            req.body.mongo.tablePrefix = this.checkOrAppendUnderline(prefix);
        }

        if (req.body.mysql) {
            const prefix: string = req.body.mysql.tablePrefix;
            req.body.mysql.tablePrefix = this.checkOrAppendUnderline(prefix);
        }
    }
}