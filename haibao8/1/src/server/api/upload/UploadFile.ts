import * as path        from 'path';
import * as multiparty  from 'multiparty';

import * as Common      from '../../common';
import * as Utils       from '../../utils';
import * as db          from '../../db';
import * as Weixin      from '../../weixin';

import * as Base        from '../base';

export class UploadFile  {
    private static async promiseParseForm(form, req): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            form.parse(req, (error, fields, files) => {
                if (error){
                    reject(error);
                }

                const info = {
                    fields,
                    files
                };

                resolve(info);
            });
        });
    }

    // 上传文件 
    public static async uploadFile(req: Base.ExpressRequest): Promise<any> {
        const uploadPath: string = path.join(__dirname, `../webroot/upload`);
        await Common.FileUtils.ensureDirExists(uploadPath);

        const options = {
            maxFileSize:    2 * 1024 * 1024 *1024, //2G
            maxFileCount:   1000 //1000个
        };

        const form: any = new multiparty.Form();
        form.encoding       = 'utf-8';
        form.maxFilesSize   = options.maxFileSize;
        form.maxFields      = options.maxFileCount;
        form.uploadDir      = uploadPath;// baseDir;

        const info = await this.promiseParseForm(form, req);
        const files = info.files;

        for(const key of Object.keys(files)){                        
            const fileName:     string = files[key][0].path;
            const cosConfigs:   Utils.ApiTypes.TencentCosConfigs = await db.settings.getTencentCosConfigs();
            const downloadPath: string = await Weixin.weixinFuncs.uploadFileToCos(cosConfigs, fileName);
            await Common.FileUtils.unlink(fileName);
            files[key][0].path = downloadPath;
        }

        return files;
    }
}