import moment               from 'moment';
import * as url             from 'url';
import * as querystring     from 'querystring';
import { browserHistory }   from 'react-router';
import Base64               from 'js-base64';

export interface DateQueryParams {
    // timeNum:        number;
    // timeType:       string;
    startDate:      number;
    endDate:        number;
}

export interface PaginationQueryParams {
    current:        number;
    pageSize:       number;
    sort:           string;
    desc:           boolean;
}

export class CommonFuncs {
    // 判断是不是一个有效的电子邮箱地址
    public static isEmailValid(email: string): boolean {
        const emailReg: RegExp  = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
        const bValid:   boolean = emailReg.test(email);
        return bValid;
    }

    // 将毫秒数转化为可读的日期时间字符串
    public static displayDateTime(mmSeconds: number): string {
        const result: string = moment(mmSeconds).format('YYYY-MM-DD HH:mm:ss');
        return result;
    }

    // 将字符串的首字母大写
    public static CapitalFirstLetter(text: string): string {
        let result: string  = '';
        let bFirst: boolean = true;

        for (const x of text) {
            if (bFirst) {
                result += x.toUpperCase();
                bFirst = false;
            } else {
                result += x;
            }
        }
        return result;
    }

    // 获取最近多长时间
    public static getRecentTime(num: number, type: any): moment.Duration {
        return moment.duration().subtract(num, type);
    }

    // 获取url查询参数
    public static getUrlQueryParams(href: string): any {
        let query: any = null;
        
        if (process.env.NODE_ENV === 'production') {
            query = Base64.Base64.decode(url.parse(href).query || '');
        } else {
            query = url.parse(href).query || '';
        }
        
        try {
            const params = querystring.parse(query);
            return params;
        } catch (error) {
            return {};
        }
    }

    // 生成 queryParams
    public static makeUrlQueryParams(params: any, isBase64: boolean): string {
        let queryString: string = querystring.stringify(params);
            
        if (process.env.NODE_ENV === 'production' && isBase64) {
            queryString = Base64.Base64.encode(queryString);
        }

        return queryString;
    }

    // 跳转到页
    public static gotoPage(routerFullPath: string, params: any) {
        let path: string = routerFullPath;

        if (params) {
            const queryString = CommonFuncs.makeUrlQueryParams(params, true);
            
            path = `${routerFullPath}?${queryString}`;
        }

        browserHistory.push(path);
    }

    // 获取开始结束时间戳
    public static handleGetStartEndDate(timeNum: number, timeType: string): number[] {
        const endDate: number   = Math.floor(Date.now());
        const startDate: number = endDate + this.getRecentTime(timeNum, timeType).asMilliseconds();

        return [startDate, endDate];
    }

    public static initDateQueryParams(): DateQueryParams {
        return {
            // timeNum:    0,
            // timeType:   'all',
            startDate:  0,
            endDate:    0
        };
    }

    public static initPaginationQueryParams(sort: string, desc: boolean): PaginationQueryParams {
        return {
            current:    1,
            pageSize:   20,
            sort,
            desc      
        };
    }

    // 深拷贝
    public static deepCopy(obj: any): any {
        // 数组
        if (obj instanceof Array) {
            const newArr: any[] = [];
    
            for (const o of obj) {
                newArr.push(CommonFuncs.deepCopy(o));
            }
    
            return newArr;
        }

        // 方法
        if (obj instanceof Function) {
            const newFunction = new Function('return ' + obj.toString())();
    
            return newFunction;
        }
        
        // 对象
        if (obj instanceof Object) {
            const newObj = {};
    
            for (const i in obj) {
                if (obj[i]) {
                    newObj[i] = CommonFuncs.deepCopy(obj[i]);
                }
            }
    
            return newObj;
        }

        return obj;
    }

    // // 查找树结构中的任意节点
    // public static findOneNodeOfTreeByID(ID: number, datas: any[]) {
    //     if (ID) {
    //         for (const d of datas) {
    //             if (d.departmentID === ID) {
    //                 return d;
    //             }
    
    //             if (d.children && d.children.length > 0) {
    //                 const result = CommonFuncs.findOneNodeOfTreeByID(ID, d.children);
    //                 if (result) {
    //                     return result;
    //                 } else {
    //                     continue;
    //                 }
    //             }
    //         }
    //     }
    // }

    // // 删除树中的任意节点
    // public static deleteOneNodeOfTreeByID(ID: number, datas: any[]) {
    //     if (ID) {
    //         const node = CommonFuncs.findOneNodeOfTreeByID(ID, datas);

    //         if (node.PID) {
    //             const parentNode = CommonFuncs.findOneNodeOfTreeByID(node.PID, datas);

    //             if (parentNode) {
    //                 parentNode.children = parentNode.children.filter((n: any) => n.departmentID !== ID);
    //             }
    //         }

    //     }

    //     return datas;
    // }

    public static bindObjectHandleMethods(obj: Object) {
        for (const key in obj) {
            if (typeof obj[key] === 'function' && key.startsWith('handle')) {
                obj[key] = obj[key]['bind'](obj);
            }
        }
    }
}