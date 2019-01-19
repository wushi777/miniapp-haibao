import * as md5         from 'md5';
import { BaseApi }      from './BaseApi';
import * as ApiTypes    from './ApiTypes';

// 安装接口
export class InstallApi extends BaseApi {
    // 检查是否已安装
    public async checkInstalled(): Promise<boolean> {
        const params = {};
        const data: boolean = await this.http.get('/api/install/check', params);
        return data;
    }

    // 全新安装
    public async newInstall(
        mongo:      ApiTypes.MongoInfo, 
        adminName:  string,
        password:   string,
        clearAll:   boolean
    ): Promise<boolean> {
        const params = {
            mongo,
            adminName,
            password: md5(password).toString(),
            clearAll
        };

        const data: boolean = await this.http.post('/api/install/new', params);
        return data;
    }

    // 添加到集群
    public async addToCluster(serverUrl: string, adminName: string, password: string): Promise<boolean> {
        const params = {
            serverUrl,
            adminName,
            password: md5(password).toString()
        };
        
        const data: boolean = await this.http.post('/api/install/addto', params);
        return data;
    }
}