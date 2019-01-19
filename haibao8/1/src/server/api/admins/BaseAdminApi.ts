import * as Base    from '../base';
import * as Utils   from '../../utils';

export class BaseAdminApi extends Base.BaseTokenApi {
    constructor(app: Base.ExpressApp) {
        super(app);
        this.tokenPrefix = 'Admins-';
    }

    protected async getCurrentToken(req: Base.ExpressRequest): Promise<Utils.ApiTypes.AdminInfo> {
        const data: Base.TokenCustomData = await super.getCurrentToken(req);
        const result = <Utils.ApiTypes.AdminInfo>data;
        return result;
    }
}