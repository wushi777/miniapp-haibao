import * as Base                from '../base';

import { AccountsApi }          from './AccountsApi';
import { DosagesApi }           from './DosagesApi';
import { MyPostersApi }         from './MyPostersApi';
import { OrdersApi }            from './OrdersApi';
import { PosterFavoritesApi }   from './PosterFavoritesApi';
import { ShopsApi }             from './ShopsApi';
import { UploadApi }            from './UploadApi';

export const api = (app: Base.ExpressApp): void => {
    new AccountsApi(app);
    new DosagesApi(app);
    new MyPostersApi(app);
    new OrdersApi(app);
    new PosterFavoritesApi(app);
    new ShopsApi(app);
    new UploadApi(app);
}
