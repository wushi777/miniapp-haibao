import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const PromiseGetDatabaseSettings = (): ReducerTool.PromiseAction<any> => {
    const promise: Promise<any> = Utils.http.settingsApi.getDBSettings();
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetDBInfoAction, promise);
    return action;
};