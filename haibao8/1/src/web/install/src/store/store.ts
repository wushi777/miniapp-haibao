import * as redux               from 'redux';
import { resetEnhancer }        from './resetEnhancer';
import { promiseMiddleware }    from './promiseMiddleware';

let gStore: any = null;

export const initStore = (originalReducers: any): any => {
    const reducer = redux.combineReducers(originalReducers);

    const win: any = window;

    const middlewares: any[] = [];

    middlewares.push(promiseMiddleware);

    if (process.env.NODE_ENV !== 'production') {
        const immutable = require('redux-immutable-state-invariant').default;
        const x = immutable();
        middlewares.push(x);
    }

    const storeEnhancers: any = redux.compose(
        resetEnhancer,
        
        redux.applyMiddleware(...middlewares),

        (win && win.devToolsExtension) ? win.devToolsExtension() : (f) => f,
    );

    const initialState = {};

    gStore = redux.createStore(reducer, initialState, storeEnhancers);

    gStore._reducers = originalReducers;

    return gStore;
};

export const getStore = (): any => {
    return gStore;
};