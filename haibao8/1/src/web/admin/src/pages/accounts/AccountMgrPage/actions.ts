import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseQueryAccountList = (
    search: string, 
    sort:   string, 
    desc:   boolean, 
    from:   number, 
    count:  number
): ReducerTool.PromiseAction<Utils.ApiTypes.AccountInfoPageData> => {
    const promise: Promise<Utils.ApiTypes.AccountInfoPageData> = Utils.http.accountsApi.queryAccountPageData(
        search, sort, desc, from, count);
        
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryAccountListAction, promise);
    return action;
};