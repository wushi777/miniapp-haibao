export class SysUtils {
    public static safeBoolean(x: any): boolean {
        if ((x === 'false') || (x === '0') || (x === 'no') || (x === 'off')) {
            return false;
        } else {
            return !!x;
        }
    }

    public static safeNumber(value: any): number {
        const x: number = Number(value);

        if (Number.isNaN(x)) {
            return 0;
        }

        return x;
    }

    public static safeString(value: any): string {
        if ((value === undefined) || (value === null)) {
            return '';
        }

        const x: string = String(value);

        return x;
    }
    
    //判断一个对象是否至少含有一个属性
    public static hasAnyProperty(obj: any): boolean {
        if (typeof obj !== 'object') {
            return false;
        }

        const keys: string[] = Object.keys(obj);
        if (keys.length === 0) {
            return false;
        }

        return true;
    }

    //判断一个对象是否是空对象(没有任何属性)
    public static isEmptyObject(obj: any): boolean {
        return !this.hasAnyProperty(obj);
    }

    public static numberArray(stringArray: any): number[] {
        const result: number[] = [];
        if (Array.isArray(stringArray)) {
            for (const item of stringArray) {
                result.push(this.safeNumber(item));
            }
        }
        return result;
    }

    public static stringArray(stringArray: any): string[] {
        const result: string[] = [];
        if (Array.isArray(stringArray)) {
            for (const item of stringArray) {
                result.push(this.safeString(item));
            }
        }
        return result;
    }

    //回调函数格式的调用转成Promise格式的调用
    //当obj是对象里, method必须为该对象的一个方法
    //当obj是一个普通的函数时,method必须省略
    public static promisify(obj: any, method: Function, ...args): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (typeof obj === 'object'){
                method.call(obj, ...args, (error, data) => {
                    if (error){
                        reject(error);
                    }else{
                        resolve(data);
                    }
                });
            } else if (typeof obj === 'function') {
                obj.call(...args, (error, data) => {
                    if (error){
                        reject(error);
                    } else {
                        resolve(data);
                    }
                })
            } else {
                reject(new Error('Params invalidate.'));
            }
        });
    }

    public static async promiseParseForm(form, req): Promise<any> {
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
}

