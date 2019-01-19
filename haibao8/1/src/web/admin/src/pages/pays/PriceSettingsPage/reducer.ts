import { stateKey }     from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export interface PriceSettingsStates {
    error:                        any;
    inited:                       boolean;

    getPriceSettingsPending:      boolean;
    getPriceSettingsResult:       Utils.ApiTypes.DosageUnitPrice | null;

    setPriceSettingsPending:      boolean;
    setPriceSettingsResult:       boolean;

}

export const initialState: PriceSettingsStates = {
    error:                      null,
    inited:                     false,
    
    getPriceSettingsPending:    false,
    getPriceSettingsResult:     null,

    setPriceSettingsPending:    false,
    setPriceSettingsResult:     false,

};

class Combine {}

export const reducer = (state: PriceSettingsStates = initialState, action: ReducerTool.BaseAction): PriceSettingsStates => {
    const newState = ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};