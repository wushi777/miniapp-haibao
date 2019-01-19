import * as url         from 'url';
import * as path        from 'path';

import * as Common      from '../common';

import * as ApiTypes    from './ApiTypes';

class Configs {
    public serverUrl:   string  = 'https://localhost:8000';
    public logConsole:  boolean = true;
    public dataPath:    string  = './data/';

    public dbInfo: ApiTypes.DBInfo = {};

    private makeConfigFileName(): string {
        const urlObject = url.parse(this.serverUrl);
        const result: string = path.join(this.configsPath, `${urlObject.hostname}.json`);
        return result;
    }

    private async ensureAllPathExists(): Promise<void> {
        //确保数据目录存在
        await Common.FileUtils.ensureDirExists(this.dataPath);
        
        //确保配置目录存在
        await Common.FileUtils.ensureDirExists(this.configsPath);

        //确保日志目录存在
        await Common.FileUtils.ensureDirExists(this.logPath);

        //确保文件上传目录存在
        await Common.FileUtils.ensureDirExists(this.uploadPath);

        //确保语言目录存在
        //await Common.FileUtils.ensureDirExists(this.languagePath);
    }

    public async init(
        serverUrl:  string,
        logConsole: boolean,
        dataPath:   string
    ): Promise<void> {
        this.serverUrl  = serverUrl;
        this.logConsole = logConsole;
        this.dataPath   = dataPath;

        await this.ensureAllPathExists();

        await this.loadDbInfo();        
    }

    private async loadDbInfo(): Promise<void> {
        const configFile: string = this.makeConfigFileName();
        const bExists: boolean = await Common.FileUtils.exists(configFile);
        if (bExists) {
            const content: string = await Common.FileUtils.readFileUTF8(configFile);
            this.dbInfo = Common.StrUtils.jsonParse(content);
        }
    }

    public async saveDbInfo(): Promise<void> {
        const configFile:   string = this.makeConfigFileName();
        const content:      string = Common.StrUtils.jsonStringify(this.dbInfo);
        await Common.FileUtils.writeFileUTF8(configFile, content);
    }

    public get serverProtocol(): string {
        const urlObject = url.parse(this.serverUrl);
        const result: string = urlObject.protocol;
        return result;
    }

    public get serverHost(): string {
        const urlObject = url.parse(this.serverUrl);    
        const result: string = urlObject.host;
        return result;
    }

    public get serverPort(): number {
        const urlObject = url.parse(this.serverUrl);
        if (urlObject.port) {
            const result: number = Common.SysUtils.safeNumber(urlObject.port);
            return result;
        } else {
            const result: number = urlObject.protocol === 'https' ? 443 : 80;
            return result;
        }
    }

    public get configsPath(): string {
        const result: string = path.join(this.dataPath, './configs/');
        return result;
    }

    public get languagePath(): string {
        const result: string = path.join(this.dataPath, './language/');
        return result;
    }

    public get uploadPath(): string {
        const result: string = path.join(this.dataPath, './upload/');
        return result;
    }

    public get logPath(): string {
        const result: string = path.join(this.dataPath, './logs');
        return result;
    }
}

export const configs = new Configs();