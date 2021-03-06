// form表单字段的验证规则
export const ShopCatDrawForm = {
    shopCatRules: [
        {
            required:   true,
            message:    '请输入海报分类名称'
        }
    ]
    // realRules: [
    //     {
    //         required:   true,
    //         message:    '请输入海报真实姓名'
    //     }
    // ],
    // passRules: [
    //     {
    //         required:   true,
    //         message:    '请输入海报密码'
    //     }
    // ],
    // joinCountRules: [
    //     {
    //         required:   true,
    //         message:    '请输入点数'
    //     }
    // ]
};

export const DrawerStyle = {
    height:         'calc(100% - 55px)',
    overflow:       'auto',
    paddingBottom:  53
};

export const CancelButtonStyle = {
    marginRight:    8
};
