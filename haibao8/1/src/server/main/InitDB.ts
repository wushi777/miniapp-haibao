import * as path        from 'path';

import * as db          from '../db';
import * as Utils       from '../utils';
import * as Common      from '../common';
import { MongoDriver}   from '../db/driver/MongoDriver';

export class InitDB {
    private static async deleteTables(): Promise<void> {
        const tableNames: string[] = [
            db.posters.fullTableName,
            db.posterCats.fullTableName,
            db.posterSlides.fullTableName,

            // db.shops.fullTableName,
            db.shopSlides.fullTableName
        ];

        const driver: MongoDriver = <MongoDriver>db.posters.driver;
        const tables: any[] = await driver.db.collections();

        for (const item of tables) {
            if (tableNames.includes(item.collectionName)) {
                await driver.db.dropCollection(item.collectionName);
            }
        }
    }

    private static async initPosterDB(rootUrl: string, defaultData: any): Promise<void> {
        let orderNum: number;

        //轮播
        orderNum = 0;
        for (const item of defaultData.posterSlides) {
            const posterSlideID: number = await db.posterSlides.createPosterSlide(
                item.name, '', rootUrl + item.url, '', orderNum);

            orderNum++;
        }

        //分类
        orderNum = 0;
        for (const item of defaultData.posterCats) {
            const posterCatID: number = await db.posterCats.createPosterCat(
                item.name, item.desc, item.hotspot, orderNum);

            orderNum++;
        }

        //Poster
        const catPageData: Utils.ApiTypes.PosterCatPageData = await db.posterCats.queryPosterCatPageData(
            '', 'orderNum', false, 0, 0);

        let posterCatIndex: number = 0;
        for (const item of defaultData.posters) {
            const posterCatID: number = catPageData.data[posterCatIndex].posterCatID;

            posterCatIndex++;
            if (posterCatIndex >= catPageData.data.length) {
                posterCatIndex = 0;
            }

            const posterID: number = await db.posters.createPoster(
                [posterCatID], item.name, item.desc, '', rootUrl + item.posterUrl /*, rootUrl + item.thumbUrl */);
        }
    }

    private static async initShopDB(rootUrl: string, defaultData: any): Promise<void> {
        let orderNum: number;

        //轮播
        orderNum = 0;
        for (const item of defaultData.shopSlides) {
            const shopSlideID: number = await db.shopSlides.createShopSlide(
                item.name, '', rootUrl + item.url, '', orderNum);

            orderNum++;
        }

        // //分类
        // orderNum = 0;
        // for (const item of defaultData.shopCats) {
        //     const shopCatID: number = await db.shopCats.createShopCat(item, item.desc, item.hotspot, orderNum);
        //     orderNum++;
        // }

        // //Shop
        // const catPageData: Utils.ApiTypes.ShopCatPageData = await db.shopCats.queryShopCatPageData(
        //     '', 'orderNum', false, 0, 0);
            
        // let shopCatIndex: number = 0;
        // for (const item of defaultData.shops) {
        //     const shopCatID: number = catPageData.data[shopCatIndex].shopCatID;

        //     shopCatIndex++;
        //     if (shopCatIndex >= catPageData.data.length) {
        //         shopCatIndex = 0;
        //     }

        //     const shopID: number = await db.shops.createShop(
        //         [shopCatID], item.name, item.desc, '', rootUrl + item.shopUrl, rootUrl + item.thumbUrl);
        // }
    }

    public static async run(rootUrl: string): Promise<void> {
        await this.deleteTables();

        const fileName:     string  = path.join(__dirname, './default.json');
        const text:         string  = await Common.FileUtils.readFileUTF8(fileName);
        const defaultData:  any     = Common.StrUtils.jsonParse(text);

        // const rootUrl = 'http://localhost:5757';
        await this.initPosterDB(rootUrl, defaultData);
        await this.initShopDB(rootUrl, defaultData);
    }
}