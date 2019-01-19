import * as ActionTypes from './actionTypes';
import * as Utils       from '../../../utils';
import { ReducerTool }  from '../../../common';

export const changeState = (params: any): ReducerTool.ChangeStateAction => {
    const action = ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

// 获取消费记录列表
export const promiseQueryDosageList = (
    accountID:  number, 
    startDate:  number, 
    endDate:    number, 
    from:       number, 
    count:      number, 
    sort:       string, 
    desc:       boolean
): ReducerTool.PromiseAction<Utils.ApiTypes.DosageInfoPageData> => {
    const promise: Promise<Utils.ApiTypes.DosageInfoPageData> = Utils.http.dosagesApi.queryDosagePageData(
        accountID, startDate, endDate, from, count, sort, desc);
        
    const action = ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseQueryDosageListAction, promise);
    return action;
};