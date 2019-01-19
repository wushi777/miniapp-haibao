import * as Base        from '../base';

import { MiscApi }      from './MiscApi';
import { PaysApi }      from './PaysApi';
import { PostersApi }   from './PostersApi';
import { ShopsApi }     from './ShopsApi';

export const api = (app: Base.ExpressApp): void => {
    new MiscApi(app);
    new PaysApi(app);
    new PostersApi(app);
    new ShopsApi(app);
}