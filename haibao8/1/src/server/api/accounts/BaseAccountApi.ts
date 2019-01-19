import * as Base    from '../base';
import * as Utils   from '../../utils';

export class BaseAccountApi extends Base.BaseTokenApi {
    constructor(app: Base.ExpressApp) {
        super(app);
        this.tokenPrefix = 'Accounts-';
    }

    protected async getCurrentToken(req: Base.ExpressRequest): Promise<Utils.ApiTypes.AccountInfo> {
        const data: Base.TokenCustomData = await super.getCurrentToken(req);
        const result = <Utils.ApiTypes.AccountInfo>data;
        return result;
    }
}