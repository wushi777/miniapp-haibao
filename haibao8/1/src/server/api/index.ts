import * as install     from './install';
import * as admins      from './admins';
import * as accounts    from './accounts';
import * as misc        from './misc';

import { 
    ApiFuncs,
    ExpressApp
} from './base';

export {
    ApiFuncs
}

export const api = (app: ExpressApp): void => {
    install.api(app);
    admins.api(app);
    accounts.api(app);
    misc.api(app);
};
