export interface BaseAction {
    type: string;
}

export interface PromiseAction<T> extends BaseAction {
    promise: Promise<T>;
}

export interface ChangeStateAction extends BaseAction {
    params: {};
}

export class Funcs {
    public static makeChangeStateAction(type: string, params: {}): ChangeStateAction {
        const action = {
            type,
            params
        };
        return action;
    }

    public static makePromiseAction<T>(type: string, promise: Promise<T>): PromiseAction<T> {
        const action = {
            type,
            promise
        };
        return action;
    }

    // 将state[stateKey]中所有的字段映射到props
    public static mapStateToProps(state: any, stateKey: string, ownProps: any = {}): any {
        const current = state[stateKey] || {};
    
        const props = {
            ...current,
            ...ownProps
        };
    
        return props;
    }

    // 使用 Combine 对 Action 进行 Reduce 处理
    public static reduce(state: any, action: any, combine: any, stateKey: string): any {
        if (action.type.startsWith('@@')) {
            return state;
        }

        const arr = action.type.split('/');

        if (arr.length !== 2) {
            const error = new Error(`action.type: ${action.type} 格式不合法`);
            throw error;
        }

        // 过滤别人的action
        if (arr[0] !== stateKey) {
            return state;
        }
        
        // 处理异步Action
        if (action.promisePending !== undefined) {
            const x = Funcs.reducePromiseAction(state, action, arr[1]);
            return x;
        }

        // 处理ChangeStateAction
        if (arr[1] === 'changeState') {
            const x = Funcs.reduceChangeStateAction(state, action);
            return x;
        }

        // 使用 Combine 处理 Action
        const method = arr[1];
        const func = combine[method];
        if (typeof func !== 'function') {
            const error = Error(`${action.type}: Combine.${method}(state, action) 方法不存在`);
            throw error;
        }

        const newState = func(state, action);
        return newState;
    }

    private static forcePropertyExists(object: Object, propName: string): void {
        if (!object.hasOwnProperty(propName)) {
            const error = new Error(`${propName}字段不存在.`);
            throw error;
        }
    }

    private static reduceChangeStateAction(state: any, action: any): any {
        const newState = {
            ...state
        };

        for (const key of Object.keys(action.params)) {
            Funcs.forcePropertyExists(state, key);
            newState[key] = action.params[key];
        }

        return newState;
    }

    private static reducePromiseAction(state: any, promiseAction: any, promiseKey: string): any {
        const pendingField  = promiseKey + 'Pending';
        const resultField   = promiseKey + 'Result';
        const errorField    = 'error';
        
        Funcs.forcePropertyExists(state, pendingField);
        Funcs.forcePropertyExists(state, resultField);
        Funcs.forcePropertyExists(state, errorField);

        const newState: any = {
            ...state,
            [pendingField]:   promiseAction.promisePending
        };

        if (promiseAction.promiseResult !== undefined) {
            newState[resultField] = promiseAction.promiseResult;
        } else if (promiseAction.promiseError) {
            newState[errorField] = promiseAction.promiseError;
        } 

        return newState;
    }
}