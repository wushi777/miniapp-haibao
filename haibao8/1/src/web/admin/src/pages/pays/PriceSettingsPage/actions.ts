import * as ActionTypes from './actionTypes';
import * as Common      from '../../../common';
import * as Utils       from '../../../utils';

export const changeState = (params: any): Common.ReducerTool.ChangeStateAction => {
    const action = Common.ReducerTool.Funcs.makeChangeStateAction(ActionTypes.ChangeStateAction, params);
    return action;
};

export const promiseGetPriceSettings = (): Common.ReducerTool.PromiseAction<any> => {
    const promise: Promise<any> = Utils.http.settingsApi.getPriceSettings();
    const action = Common.ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseGetPriceSettingsAction, promise);
    return action;
};

export const promiseSetPriceSettings = (dosageUnitPrice: Utils.ApiTypes.DosageUnitPrice): Common.ReducerTool.PromiseAction<any> => {
    const promise: Promise<any> = Utils.http.settingsApi.setPriceSettings(dosageUnitPrice);
    const action = Common.ReducerTool.Funcs.makePromiseAction(ActionTypes.PromiseSetPriceSettingsAction, promise);
    return action;
};