const RESET_ACTION_TYPE = '@@RESET';

const resetReducerCreator = (reducer, changeState) => (state, action) => {
    if (action.type === RESET_ACTION_TYPE) {
        return changeState;
    } else {
        return reducer(state, action);
    }
};

export const resetEnhancer = (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer);

    const reset = (resetReducer, changeState) => {
        const newReducer = resetReducerCreator(resetReducer, changeState);
        
        store.replaceReducer(newReducer);

        const action = {
            type:   RESET_ACTION_TYPE,
            state:  changeState
        };

        store.dispatch(action);
    };

    return {
        ...store,
        reset
    };
};