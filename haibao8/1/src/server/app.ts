import * as path    from 'path';
 
import * as Common  from './common';
import * as Utils   from './utils';
import * as Main    from './main';

export class Server {
    public httpServer:  Main.HttpServer  = null;

    constructor(){
        Common.logger.addCategory(Utils.MyTypes.logCats.HttpRequest);
        Common.logger.addCategory(Utils.MyTypes.logCats.Other);

        Common.logger.log(Utils.MyTypes.logCats.Other, '-------------------------Server Begin----------------------');
    }

    private printUsage(){
        Common.logger.error('命令行参数错误, 启动失败, 请阅读下面的用法和示例:');
        Common.logger.log(Utils.MyTypes.logCats.Other, '用法: node ./bin/server/server serverUrl=xxx logConsole=1 dataPath=xxx');
        Common.logger.log(Utils.MyTypes.logCats.Other, Common.logger.yellowBegin, 'serverUrl    ', Common.logger.colorEnd, ':  本项目服务器 HTTP 地址, 形如: https://192.168.0.51:8000');
        Common.logger.log(Utils.MyTypes.logCats.Other, Common.logger.yellowBegin, 'logConsole   ', Common.logger.colorEnd, ':  是否将日志输出到终端, 1表示输出到终端,0表示不输出到终端');
        Common.logger.log(Utils.MyTypes.logCats.Other, Common.logger.yellowBegin, 'dataPath     ', Common.logger.colorEnd, ':  配置信息、日志、上传文件等数据的保存目录');
        
        Common.logger.log(Utils.MyTypes.logCats.Other, '示例: node "./bin/server/server" "serverUrl=https://192.168.0.51:8000" "logConsole=1" "dataPath=./data/" ');
    }

    private async tryInit(): Promise<void> {
        const args: string[] = process.argv.splice(2);
        Common.logger.log(Utils.MyTypes.logCats.Other, '命令行参数:', args);

        let serverUrl:  string  = '';
        let logConsole: boolean = true;
        let dataPath:   string  = '';

        if (args.length === 3) {
            //读取参数
            for (const item of args) {
                const arr = item.split('=');
                if (/serverUrl/ig.test(arr[0])){
                    serverUrl = Common.SysUtils.safeString(arr[1]);
                } else if (/logConsole/ig.test(arr[0])) {
                    logConsole = Common.SysUtils.safeBoolean(arr[1]);
                } else if (/dataPath/ig.test(arr[0])) {
                    dataPath = Common.SysUtils.safeString(arr[1]);
                    dataPath = path.join(__dirname, dataPath);
                }
            }
        } else {
            serverUrl   = 'http://localhost:5757';
            dataPath    = path.join(__dirname, './data/');
            logConsole  = true;
        }

        if ((!serverUrl) || (!dataPath)) {
            this.printUsage();
            process.exit();
        }

        try {
            await Utils.configs.init(serverUrl, logConsole, dataPath);
        } catch (err) {
            console.log(err);
            process.exit();
        }

        Common.logger.setLogPath(Utils.configs.logPath);
        Common.logger.logConsole = Utils.configs.logConsole;

        await Main.connectDB.tryConnectDatabases();

        // if (Utils.configs.dbInfo.inited) {
        //     if (bNeedInitDB) {
        //         Common.logger.log(Utils.MyTypes.logCats.Other, '正在初始化默认数据......');
        //         await Main.InitDB.run(rootUrl);
        //         Common.logger.log(Utils.MyTypes.logCats.Other, '完成初始化默认数据');
        //     }
        // }
    }

    //尝试创建HTTP服务器
    private async tryCreateHttpServer(): Promise<void> {
        this.httpServer = new Main.HttpServer();
        await this.httpServer.createHttpServer();
    }

    //启动运行
    public async run(): Promise<void> {
        try{
            await this.tryInit();

            await this.tryCreateHttpServer();
        }catch(error){
            Common.logger.error(error);
            process.exit();
        }
    }
}

process.on('unhandledRejection', (reason, p) => {
    Common.logger.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    // application specific logging, throwing an error, or other logic here
});

const startServer = async () => {
    try {
        const server = new Server();
        await server.run();
    } catch (err) {
        Common.logger.error(err);
    }
}

startServer();
