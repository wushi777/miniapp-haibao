import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

import * as Common  from '../common';

interface TokenData {
    tokenID:        number;
    prefix:         string;
    accessToken:    string;
    createDate:     number;
    lastAccessDate: number;
    dbAccessDate:   number;
    customData:     any;
}

export class TokensDB extends BaseDB {
    private dbLoaded:   boolean = false;
    private tokensMap:  Map<string, TokenData> = new Map();

    public expireMMSeconds: number = 1000 * 3600 * 24 * 7; // 七天强制过期

    constructor() {
        super();
        this.checkExpire();
    }

    get tableName(): string {
        return DBConsts.tables.tokensTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.tokenID;
    }

    public async getToken(
        prefix:         string, 
        accessToken:    string,
    ): Promise<any> {
        await this.checkOrLoadTokensFromDB();

        const key:          string      = this.makeAccessTokenKey(prefix, accessToken);
        const tokenData:    TokenData   = this.tokensMap.get(key);

        if (!tokenData) {
            return null;
        }

        tokenData.lastAccessDate = Common.DateUtils.now();

        const date1: Date = new Date(tokenData.lastAccessDate);
        const date2: Date = new Date(tokenData.dbAccessDate);

        if (!Common.DateUtils.sameDay(date1, date2)) {
            tokenData.dbAccessDate = tokenData.lastAccessDate;

            const filter = {
                tokenID: tokenData.tokenID
            };

            const update = {
                $set: {
                    lastAccessDate: tokenData.lastAccessDate,
                    dbAccessDate:   tokenData.dbAccessDate
                }
            };

            await this.queryUpdate(filter, update);
        }

        return tokenData.customData;
    }

    public async setToken(
        prefix:         string, 
        accessToken:    string, 
        customData:     any
    ): Promise<void> {
        const tokenData: TokenData = await this.getToken(prefix, accessToken);

        if (tokenData) {
            return;
        }
        
        const createDate:       number = Common.DateUtils.now();
        const lastAccessDate:   number = createDate;
        const dbAccessDate:     number = createDate;

        const doc: TokenData = {
            tokenID: 0,
            prefix,
            accessToken,
            createDate,
            lastAccessDate,
            dbAccessDate,
            customData
        };

        const tokenID: number = await this.queryInsertOne(doc);
        doc.tokenID = tokenID;

        const key: string = this.makeAccessTokenKey(prefix, accessToken);
        this.tokensMap.set(key, doc);
    }

    public async deleteToken(
        prefix:         string, 
        accessToken:    string,
    ): Promise<void> {
        const key: string = this.makeAccessTokenKey(prefix, accessToken);
        
        const tokenData: TokenData = this.tokensMap.get(key);
        if (tokenData) {
            const filter = {
                tokenID: tokenData.tokenID
            };

            await this.queryDelete(filter);
        }

        this.tokensMap.delete(key);
    }

    private makeAccessTokenKey(
        prefix:         string, 
        accessToken:    string
    ): string {
        const key: string = `${prefix}${accessToken}`;
        return key;
    }

    private async checkOrLoadTokensFromDB(): Promise<void> {
        if (this.dbLoaded) {
            return;
        }

        const filter = {};
        const infos: TokenData[] = await this.queryFind(filter);

        for (const item of infos) {
            const key: string = this.makeAccessTokenKey(item.prefix, item.accessToken);
            this.tokensMap.set(key, item);
        }

        await this.checkAndCleanTokens();

        this.dbLoaded = true;
    }

    private isTokenExpired(token: TokenData, now: number): boolean {
        const result: boolean = token.createDate + this.expireMMSeconds < now;
        return result;
    }

    private async checkAndCleanTokens(): Promise<void> {
        const now: number = Common.DateUtils.now();
        for (const item of this.tokensMap.values()) {
            if (this.isTokenExpired(item, now)) {
                await this.deleteToken(item.prefix, item.accessToken);
            } 
        }
    }

    private checkExpire() {
        setTimeout(
            async () => {
                await this.checkAndCleanTokens();
                this.checkExpire();
            },

            1000 * 3600
        )
    }
}

export default new TokensDB();