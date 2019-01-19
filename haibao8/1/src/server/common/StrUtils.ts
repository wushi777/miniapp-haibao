import * as crypto      from 'crypto';

import { MathUtils }    from './MathUtils';

export class StrUtils {
    public static md5(str: string): string {
        const hash: crypto.Hash = crypto.createHash('md5');
        hash.update(str);
        const result: string = hash.digest('hex');
        return result;
    }

    public static base64Encode(str: string): string {
        const result: string = new Buffer(str).toString('base64');
        return result;
    }

    public static base64Decode(str: string): string {
        const result: string = new Buffer(str, 'base64').toString();
        return result;
    }

    public static uuid(prefix: string): string {
        const date:     Date    = new Date();
        const time:     number  = date.getTime();
        const x:        number  = MathUtils.makeRandomNum(10000000, 99999999);
        const S:        string  = `${prefix}${time}${x}`;
        const result:   string  = this.md5(S);
        return result;
    }

    public static jsonStringify(data: any): string {
        return JSON.stringify(data, null, 4);
    }

    public static jsonParse(text: string): any {
        try {
            const result: any = JSON.parse(text);
            return result;
        } catch (err) {
            err.data = text;
            throw err;
        }
    }

    public static escapeQuotes(str: string): string {
        if ((str === undefined) || (str === null)){
            return '';
        }

        let s;
        
        if (typeof str === 'object'){
            s = this.jsonStringify(str);
        }else{
            s = str;
        }

        s = s.replace(/"/ig, '\\"');
        s = s.replace(/'/ig, "\\'");
        s = s.replace(/ /ig, "\\ ");
        return s;
    }

    public static makeMongoFindRegExp(q: string): RegExp {
        if (q) {
            let pattern = q;
            
            const specs = '\\*?^$().+|';
            for (const ch of specs) {
                pattern = pattern.replace(ch, `\\${ch}`);
            }

            const result = new RegExp(pattern, 'i');
            return result;
        } else {
            return null;
        }
    }
}

