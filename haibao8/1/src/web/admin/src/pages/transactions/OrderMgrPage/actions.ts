import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseQueryOrderList = (
    accountID:  number, 
    from:       number, 
    count:      number, 
    sort:       string, 
    desc:       boolean, 
    startDate:  number, 
    endDate:    number
): ReducerTool.PromiseAction<Utils.ApiTypes.OrderInfoPageData> => {
    const promise: Promise<Utils.ApiTypes.OrderInfoPageData> = Utils.http.ordersApi.queryOrderPageData(
        accountID, from, count, sort, desc, startDate, endDate);
        
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.promiseQueryOrderListAction, promise);
    return action;
};