import { stateKey } from './actionTypes';
import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

interface QueryParams extends Common.DateQueryParams, Common.PaginationQueryParams {
    accountID:  number;
}     

const initQueryParams = (): QueryParams => ({
    accountID:  0,

    ...Common.CommonFuncs.initDateQueryParams(),
    ...Common.CommonFuncs.initPaginationQueryParams('orderID', false),
});

export interface OrderMgrStates {
    error:                      any;
    inited:                     boolean;

    queryParams:                QueryParams;

    queryOrderListPending:      boolean;
    queryOrderListResult:       Utils.ApiTypes.OrderInfoPageData | null;
}

export const initialState: OrderMgrStates = {
    error:                      null,
    inited:                     false,
    
    queryParams:                initQueryParams(),

    queryOrderListPending:      false,
    queryOrderListResult:       null,
};

class Combine {}

export const reducer = (
    state:  OrderMgrStates = initialState, 
    action: Common.ReducerTool.BaseAction
): OrderMgrStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};