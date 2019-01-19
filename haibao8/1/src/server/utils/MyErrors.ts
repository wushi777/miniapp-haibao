export const myErrors = {
    Param_accessToken_Error:    'accessToken 参数错误'
};

for (const key of Object.keys(myErrors)) {
    myErrors[key] = {
        name:       key,
        message:    myErrors[key]
    };
}