// import * as api   from '../api';

const adminNameKey          = 'adminName';
const adminAccessTokenKey   = 'adminAccessToken';
// const adminInfoKey          = 'adminInfo';

class MyStorage {
    public get adminAccessToken(): any {
        return this.getItem(adminAccessTokenKey, sessionStorage);
    }

    public set adminAccessToken(adminAccessToken: any) {
        this.setItem(adminAccessTokenKey, adminAccessToken, sessionStorage);
    }

    public get adminName(): string {
        return this.getItem(adminNameKey);
    }

    public set adminName(adminName: string) {
        this.setItem(adminNameKey, adminName);
    }

    // public get adminInfo(): api.ApiTypes.AdminInfo {
    //     return this.getItem(adminInfoKey, sessionStorage);
    // }

    // public set adminInfo(adminInfo: api.ApiTypes.AdminInfo) {
    //     this.setItem(adminInfoKey, adminInfo, sessionStorage);
    // }

    private getItem(key: string, s: Storage = localStorage): any {
        const x: string | null = s.getItem(key);
        
        if (x) {
            try {
                const value = JSON.parse(x);
                return value;
            } catch (error) {
                console.log('JSON解析失败');
            }
        }

        return null;
    }

    private setItem(key: string, value: any, s: Storage = localStorage): void {
        if (!value) {
            s.removeItem(key);
            return;
        } 

        const x: string = JSON.stringify(value);
        s.setItem(key, x);
    }
}

export const storage = new MyStorage();