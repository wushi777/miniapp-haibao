import * as Base            from '../base';

import { AdminsApi }        from './AdminsApi';
import { AccountsApi }      from './AccountsApi';
import { DosagesApi }       from './DosagesApi';
import { OrdersApi }        from './OrdersApi';
import { PosterCatsApi }    from './PosterCatsApi';
import { PostersApi }       from './PostersApi';
import { PosterSlidesApi }  from './PosterSlidesApi';
import { SettingsApi }      from './SettingsApi';
import { ShopCatsApi }      from './ShopCatsApi';
import { ShopsApi }         from './ShopsApi';
import { ShopSlidesApi }    from './ShopSlidesApi';
import { UploadApi }        from './UploadApi';

export const api = (app: Base.ExpressApp): void => {
    new AdminsApi(app);
    new AccountsApi(app);
    new DosagesApi(app);
    new OrdersApi(app);
    new PosterCatsApi(app);
    new PostersApi(app);
    new PosterSlidesApi(app);
    new SettingsApi(app);
    new ShopCatsApi(app);
    new ShopsApi(app);
    new ShopSlidesApi(app);
    new UploadApi(app);
}