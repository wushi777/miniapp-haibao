import * as crypto  from 'crypto';
import * as Common  from '../common';

export class PasswordUtils {
    public static async sha256md5(s: string | number | undefined | null): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                let newString: string;

                if ((s === undefined) || (s === null)) {
                    newString = '';
                } else if (typeof s === 'number') {
                    newString = s.toString();
                } else {
                    newString = s;
                }

                const key:      string = Common.StrUtils.md5(newString);
                const hash:     string = crypto.createHmac('sha256', key).update(newString).digest('hex');
                const result:   string = Common.StrUtils.md5(hash);

                return resolve(result);
            } catch (err) {
                return reject(err);
            }
        });
    }

    // 加密密码
    public static async encryptPassword(srcPassword: string): Promise<string> {
        const passwordEn: string = await this.sha256md5(srcPassword);
        return passwordEn;
    }

    // 比较密码原文和密文是否一致
    public static async checkPassword(srcPassword: string, finalPassword: string): Promise<boolean> {
        const srcPasswordEn:    string  = await this.encryptPassword(srcPassword);
        const result:           boolean = srcPasswordEn === finalPassword;
        return result;
    }
}