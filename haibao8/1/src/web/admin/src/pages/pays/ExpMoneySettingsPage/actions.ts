import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import { http }         from '../../../utils';

export const changeState = (params: any): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseGetDefGiveMoneyFen = (): ReducerTool.PromiseAction<any> => {
    const promise: Promise<any> = http.settingsApi.getDefGiveMoneySettings();
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetDefGiveMoneyFenAction, promise);
    return action;
};

export const promiseSetDefGiveMoneyFen = (moneyFen: number): ReducerTool.PromiseAction<any> => {
    const promise: Promise<any> = http.settingsApi.setDefGiveMoneySettings(moneyFen);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseSetDefGiveMoneyFenAction, promise);
    return action;
};