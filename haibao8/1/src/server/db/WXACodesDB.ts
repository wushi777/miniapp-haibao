import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';

class WXACodesDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.wxaCodesTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.wxaCodeID;
    }

    public async getWxaCodeUrl(
        accountID:  number,
        scene:      string,
        page:       string,
        width:      number,
        auto_color: boolean,
        line_color: {r: number; g: number; b: number},
        is_hyaline: boolean
    ): Promise<string> {
        const filter: any = {
            accountID,
            scene,
            page,
            width,
            auto_color,
            line_color,
            is_hyaline
        };

        const wxaCodeInfo: any = await this.queryFindOne(filter);

        if (wxaCodeInfo) {
            return wxaCodeInfo.wxaCodeUrl
        } else {
            return '';
        }
    }

    public async createWxaCode(
        accountID:  number,
        scene:      string,
        page:       string,
        width:      number,
        auto_color: boolean,
        line_color: {r: number; g: number; b: number},
        is_hyaline: boolean,
        wxaCodeUrl: string
    ): Promise<void> {
        const doc: any = {
            accountID,
            scene,
            page,
            width,
            auto_color,
            line_color,
            is_hyaline,
            wxaCodeUrl
        };

        await this.queryInsertOne(doc);
    }
}

export default new WXACodesDB();