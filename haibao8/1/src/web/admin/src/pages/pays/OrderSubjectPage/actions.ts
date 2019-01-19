import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import { http }         from '../../../utils';

export const changeState = (params: any): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseGetOrderSubject = (): ReducerTool.PromiseAction<any> => {
    const promise: Promise<any> = http.settingsApi.getOrderSubject();
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetOrderSubjectAction, promise);
    return action;
};

export const promiseSetOrderSubject = (orderSubject: string): ReducerTool.PromiseAction<any> => {
    const promise: Promise<any> = http.settingsApi.setOrderSubject(orderSubject);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseSetOrderSubjectAction, promise);
    return action;
};