const isPromise = (obj: any): boolean => {
    return obj && typeof obj.then === 'function';
};
  
export const promiseMiddleware = ({dispatch}) => {
    return (next) => (action) => {
        const {type, promise, ...rest} = action;

        if (!isPromise(promise)) {
            return next(action);
        }
  
        // 发送 Pending 状态的 Action
        const pendingAction = {
            ...rest, 
            type,
            promisePending: true
        };
        dispatch(pendingAction);

        // 执行这个 Promise
        return action.promise.then(
            (result) => {
                // 发送 Resolved 状态的 Action
                const resolvedAction = {
                    ...rest, 
                    type,
                    promisePending: false,
                    promiseResult:  result
                };
                dispatch(resolvedAction);                
            },

            (error) => {
                // 发送 Rejected 状态的 Action
                const rejectedAction = {
                    ...rest, 
                    type,
                    promisePending: false,
                    promiseError:   error
                };
                dispatch(rejectedAction);
            }
        );
    };
};