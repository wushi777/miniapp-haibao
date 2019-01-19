import * as ActionTypes from './actionTypes';

import { http }         from '../../../utils';
import { ReducerTool }  from '../../../common';

export const changeState = (params: {}): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

// 修改密码
export const promiseModifyPassword = (
    oldPassword: string, 
    newPassword: string
): ReducerTool.PromiseAction<boolean> => {
    const promise: Promise<boolean> = http.adminsApi.modifyAdminPassword(oldPassword, newPassword);
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseModifyPasswordAction, promise);
    return action;
};
