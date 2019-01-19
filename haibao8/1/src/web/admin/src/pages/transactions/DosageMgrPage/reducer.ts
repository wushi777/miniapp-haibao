import { stateKey } from './actionTypes';
import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

interface QueryParams extends Common.DateQueryParams, Common.PaginationQueryParams {
    accountID:  number;
}     

const initQueryParams = (): QueryParams => ({
    accountID:  0,

    ...Common.CommonFuncs.initDateQueryParams(),
    ...Common.CommonFuncs.initPaginationQueryParams('dosageID', false),
});

export interface DosageMgrStates {
    error:                      any;
    inited:                     boolean;

    queryParams:                QueryParams; 

    queryDosageListPending:     boolean;
    queryDosageListResult:      Utils.ApiTypes.DosageInfoPageData | null;

    showDrawer:                 boolean;
    dosage:                     Utils.ApiTypes.DosageInfo | null;
}

export const initialState: DosageMgrStates = {
    error:                      null,
    inited:                     false,

    queryParams:                initQueryParams(),

    queryDosageListPending:     false,
    queryDosageListResult:      null,

    showDrawer:                 false,
    dosage:                     null
};

class Combine {}

export const reducer = (state: DosageMgrStates = initialState, action: Common.ReducerTool.BaseAction): DosageMgrStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};