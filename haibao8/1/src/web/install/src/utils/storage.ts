const userNameKey       = 'userName';
const accessTokenKey    = 'accessToken';

class MyStorage {
    public get accessToken(): any {
        return this.getItem(accessTokenKey, sessionStorage);
    }

    public set accessToken(accessToken: any) {
        this.setItem(accessTokenKey, accessToken, sessionStorage);
    }

    public get userName(): string {
        return this.getItem(userNameKey);
    }

    public set userName(userName: string) {
        this.setItem(userNameKey, userName);
    }

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