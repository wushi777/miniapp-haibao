import * as ActionTypes from './actionTypes';
import { http }         from '../../utils';
import { ReducerTool }  from '../../common';

export const changeState = (params: any): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseGiveMoneyToAccount = (accountID: number, orderMoneyFen: number): ReducerTool.PromiseAction<any> => {
    const promise: Promise<any> = http.accountsApi.giveMoneyToAccount(accountID, orderMoneyFen);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGiveMoneyToAccount, promise);
    return action;
};