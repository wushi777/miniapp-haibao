import * as Base        from '../base';

import { InstallApi }   from './InstallApi';

export const api = (app: Base.ExpressApp): void => {
    new InstallApi(app);
}