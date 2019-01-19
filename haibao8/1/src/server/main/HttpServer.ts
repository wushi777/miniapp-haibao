import * as express         from 'express';
import * as path            from 'path';
import * as fs              from 'fs';
import * as bodyParser      from 'body-parser';
import * as cors            from 'cors';
import * as https           from 'https';
import * as http            from 'http';
//import * as cookieParser      from 'cookie-parser';
//import * as session           from 'express-session';

import * as Common          from '../common';
import * as Utils           from '../utils';
import { api, ApiFuncs }    from '../api';

//该模块用于使 Express 的中间件支持 AsyncFunction, 并使异常可以集中处理
//注意此处只能用require,不能用import语句,否则编译后的JS文件中没有这一行
//import * as eae         from 'express-async-errors';
require('express-async-errors');


export class HttpServer {
    public express:         any = express();
    public nodeHttpServer:  https.Server | http.Server = null;

    constructor(){
        //用 cors 解决 Ajax 跨域的问题
        this.express.use('/api',    cors());
    }
    
    private async createNodeHttpServer(): Promise<void> {
        if (Utils.configs.serverProtocol === 'https:'){

            const keysPath: string = path.join(__dirname, '../keys/');

            const options = {
                key:    fs.readFileSync(keysPath + 'server.key'),
                cert:   fs.readFileSync(keysPath + 'server.crt')
            };

            this.nodeHttpServer = https.createServer(options, this.express);
        }else{
            this.nodeHttpServer = http.createServer(this.express);
        }

        this.nodeHttpServer.listen(Utils.configs.serverPort, () => {
            const url: string = Utils.configs.serverUrl;

            if (Utils.configs.serverProtocol === 'https:'){
                Common.logger.log(Utils.MyTypes.logCats.Other, `启动 Https Server 成功: ${url}`);
            }else{
                Common.logger.log(Utils.MyTypes.logCats.Other, `启动 Http Server 成功: ${url}`);
            }
        });
    }

    //记录日志
    private async setupLogger(): Promise<void> {
        this.express.use((req, res, next) => {
            const url:      string  = req.url;
            const method:   string  = req.method;

            Common.logger.log(Utils.MyTypes.logCats.HttpRequest, `>>>>> HTTP ${method}: ${url}`);

            if (req.headers.accesstoken){
                Common.logger.log(Utils.MyTypes.logCats.HttpRequest, 'req.headers.accesstoken:', req.headers.accesstoken);
            }

            if ((method === 'POST') || (method === 'PUT')){
                Common.logger.log(Utils.MyTypes.logCats.HttpRequest, 'req.body:', Common.StrUtils.jsonStringify(req.body));
            }

            next();
        });
    }

    private logHttpRequestComplete(req): void {
        const url:      string  = req.url;
        const method:   string  = req.method;
        
        Common.logger.log(Utils.MyTypes.logCats.HttpRequest, `<<<<< HTTP ${method}: ${url}`);
    }

    private async extendResponseMethod(): Promise<void> {
        this.express.use((req, res, next) => {
            (res as any).sendSuccess = () => {
                this.logHttpRequestComplete(req);
                ApiFuncs.sendWebApiSuccessResponse(res);
            };

            (res as any).sendData = (data) => {
                this.logHttpRequestComplete(req);
                ApiFuncs.sendWebApiDataResponse(res, data);
            };

            (res as any).sendError = (error) => {
                this.logHttpRequestComplete(req);
                ApiFuncs.sendWebApiErrorResponse(res, error);
            };

            next();
        });
    }

    private async setupBodyParser(): Promise<void> {
        // for parsing application/json
        const jsonRouter: any = bodyParser.json();
        this.express.use(jsonRouter); 

        // for parsing application/x-www-form-urlencoded
        const urlEncodedRouter: any = bodyParser.urlencoded({
            extended: true 
        });
        this.express.use(urlEncodedRouter); 
    }

    private async setupInstallRouter(): Promise<void> {        
        this.express.use('/install*', (req, res, next) => {
             //如果已安装, 重定向到首页
            if (Utils.configs.dbInfo.inited){
                res.redirect(302, '/');
                return;
            }
    
            return next();
        });
    
        this.express.use((req, res, next) => {
            const reB: RegExp = /\/install/i;
            if (reB.test(req.path)){
                return next();
            }
                
            const str: string = req.path;
            const pos: number = str.lastIndexOf(".");
    
            let ext: string;
            if (pos === -1){
                ext = '';
            }else{
                ext = str.substring(pos,str.length);
            }
    
            if ((ext !== '.html') && (ext !== '')) {
                return next();
            }
    
            //如果未安装,重定向到安装页
            if (!Utils.configs.dbInfo.inited) {
                res.redirect(302, '/install');
                return;
            }
    
            return next();
        });
    }

    private async setupApiRouter(): Promise<void> {
        api(this.express);
    }

    private async setupStaticPath(): Promise<void> {
        const webRootPath: string = path.join(__dirname, '../webroot');
        
        //const bowerPath = path.join(rootPath, 'bower_components');
        //this.express.use('/bower_components', express.static(bowerPath));

        //const publicPath: string = path.join(rootPath, 'bin/web');
        this.express.use(express.static(webRootPath));

        // const uploadPath: string = Utils.configStore.uploadPath;
        // this.express.use('/upload', express.static(uploadPath));

        //const accountPath = path.join(rootPath, 'bin/account');
        //this.express.use('/account', express.static(accountPath));

        //const adminPath = path.join(rootPath, 'bin/admin');
        //this.express.use('/admin', express.static(adminPath));
    }

    //配合客户端路由
    private async setupClientRouter(): Promise<void> {
        this.express.use('/install/*', (req, res) => {
            const fileName: string = path.join(__dirname, '../webroot/install/index.html');
            res.sendFile(fileName);
        });

        this.express.use('/admin/*', (req, res) => {
            const fileName: string = path.join(__dirname, '../webroot/admin/index.html');
            res.sendFile(fileName);
        });

        // this.express.use('/', (req, res) => {
        //     res.redirect(302, '/admin');
        // });
    }

    private async setupErrorHandler(): Promise<void> {
        //集中处理异常
        this.express.use((err, req, res, next) => {
            Common.logger.error('Error:', err);

            //res.status(403);
            res.sendError(err);
            next();
        });
    }

    public async createHttpServer(): Promise<void> {
        await this.createNodeHttpServer();
        await this.setupBodyParser();
        await this.setupLogger();
        await this.extendResponseMethod();
        await this.setupInstallRouter();
        await this.setupApiRouter();
        await this.setupStaticPath();
        await this.setupClientRouter();
        await this.setupErrorHandler();
    }
}