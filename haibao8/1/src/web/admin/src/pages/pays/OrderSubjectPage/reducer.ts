import { stateKey }     from './actionTypes';
import { ReducerTool }  from '../../../common';
import * as Utils       from '../../../utils';

export interface OrderSubjectStates {
    error:                        any;
    inited:                       boolean;

    getOrderSubjectPending:      boolean;
    getOrderSubjectResult:       Utils.ApiTypes.OrderSubject | null;

    setOrderSubjectPending:      boolean;
    setOrderSubjectResult:       boolean;

}

export const initialState: OrderSubjectStates = {
    error:                      null,
    inited:                     false,
    
    getOrderSubjectPending:    false,
    getOrderSubjectResult:     null,

    setOrderSubjectPending:    false,
    setOrderSubjectResult:     false,

};

class Combine {}

export const reducer = (state: OrderSubjectStates = initialState, action: ReducerTool.BaseAction): OrderSubjectStates => {
    const newState = ReducerTool.Funcs.reduce(state, action, Combine, stateKey);
    return newState;
};