import React                from 'react';
import { combineReducers }  from 'redux';

import { getStore }         from './store';

type ReducerFunc = (state: any, action: any) => any;

export const dynMountReducer = (
    WrappedComponent:   React.ComponentClass, 
    stateKey:           string, 
    reducer:            ReducerFunc, 
    initialState:       any
) => {
    return class NewComponent extends WrappedComponent {
        private oldReducers: any;

        constructor(props: any) {
            super(props);
            this.mountReducer();
        }

        public componentWillUnmount() {
            this.unmountReducer();

            if (super.componentWillUnmount) {
                super.componentWillUnmount();
            }
        }

        private mountReducer(): void {
            const store = getStore();

            this.oldReducers = store._reducers;

            const state = store.getState();

            const resetReducer = combineReducers({
                ...store._reducers,
                [stateKey]: reducer
            });

            store._reducers = {
                ...store._reducers,
                [stateKey]: reducer
            };

            const changeState = {
                ...state,
                [stateKey]: initialState
            };

            store.reset(resetReducer, changeState);
        }

        private unmountReducer(): void {
            const store = getStore();
            
            const resetReducer = combineReducers({
                ...this.oldReducers
            });

            const state = store.getState();

            const resetState = {
                ...state
            };

            delete resetState[stateKey];
            store.reset(resetReducer, resetState);
        }
    };
};