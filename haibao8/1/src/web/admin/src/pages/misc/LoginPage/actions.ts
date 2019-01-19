import * as ActionTypes from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const login = (adminName: string, password: string): ReducerTool.PromiseAction<Utils.ApiTypes.AdminLoginInfo> => {
    const promise: Promise<Utils.ApiTypes.AdminLoginInfo> = Utils.http.adminsApi.login(adminName, password);
    const action    = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseLoginAction, promise);

    return action;
};
