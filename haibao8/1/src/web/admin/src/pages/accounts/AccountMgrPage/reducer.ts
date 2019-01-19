import { stateKey } from './actionTypes';
import * as Common  from '../../../common';
import * as Utils   from '../../../utils';

interface SearchParams {
    search: string;
}

interface QueryParams extends Common.PaginationQueryParams, SearchParams {
}

const initQueryParams = (): QueryParams => ({
    ...Common.CommonFuncs.initPaginationQueryParams('accountID', true),
    search:     ''
});

export interface CompanyMgrChangState {
    
}

export interface CompanyMgrStates {
    error:                          any;
    inited:                         boolean;

    queryParams:                    QueryParams;

    queryAccountListPending:        boolean;                                    // 企业列表
    queryAccountListResult:         Utils.ApiTypes.AccountInfoPageData | null;

    showGiveMoneyDrawer:            false;                                      // 显示Drawer
    operatingAccount:               Utils.ApiTypes.AccountInfo | null;          // 当前操作的Account

}

export const initialState: CompanyMgrStates = {
    error:                          null,
    inited:                         false,

    queryParams:                    initQueryParams(),

    queryAccountListPending:        false,
    queryAccountListResult:         null,

    showGiveMoneyDrawer:            false,
    operatingAccount:               null,

};

class Combine {
}

export const reducer = (
    state:  CompanyMgrStates = initialState, 
    action: Common.ReducerTool.BaseAction
): CompanyMgrStates => {
    const newState = Common.ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};