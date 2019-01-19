// tabs
export const Tabs = {
    newInstall: {
        key:    '1',
        title:  '全新安装'
    },

    addToCluster: {
        key:    '2',
        title:  '添加到集群'
    }
};

// 表格布局
export const formItemLayout = {
    labelCol: {
        xs:     { span: 24 },
        sm:     { span: 8 }
    },

    wrapperCol: {
        xs:     { span: 24 },
        sm:     { span: 14 }
    }
};

// 是否清空原数据
export const formItemClearAllDataLayout = {
    wrapperCol: {
        xs: {
            span:   24,
            offset: 0
        },
        sm: {
            span: 16,
            offset: 8
        }
    }
};

// 全新安装表单
export const newInstallForm = {
    mongo: {
        host: {
            label:  'Mongo服务器地址',
            name:   'mongoHost',
            rules:  [
                {
                    required:   true,
                    message:    'MongoDB服务器地址不能为空'
                }
            ],
            
            initialValue:   'localhost'
        },
    
        port: {
            label:  'Mongo服务器端口',
            name:   'mongoPort',
            rules:  [
                {
                    required:   true,
                    message:    'MongoDB服务器端口不能为空'
                }
            ],
            
            initialValue:   '27017'
        },
    
        database: {
            label:  'Mongo数据库名称',
            name:   'mongoDatabase',
            rules:  [
                {
                    required:   true,
                    message:    'MongoDB数据库不能为空'
                }
            ],
            
            initialValue:   'mydb'
        },

        user: {
            label:          'Mongo用户名',
            name:           'mongoUser',
            placeholder:    '请输入MongoDB数据库用户名'
        },
    
        password: {
            label:          'Mongo密码',
            name:           'mongoPassword',
            placeholder:    '请输入MongoDB数据库密码'
        },
    
        tablePrefix: {
            label:  'Mongo表前缀',
            name:   'mongoTablePrefix',
            rules:  [
                {
                    required:   true,
                    message:    'MongoDB键前缀不能为空'
                }
            ],
            
            initialValue:   'mydb_'
        }
    },

    admin: {
        adminName: {
            label:  '管理员账号',
            name:   'adminName',
            rules:  [
                {
                    required:   true,
                    message:    '管理员账号不能为空'
                }
            ],
            
            initialValue:   'admin',
            placeholder:    '请输入管理员账号'
        },

        password: {
            label:  '管理员密码',
            name:   'adminPassword',
            rules:  [
                {
                    required:   true,
                    message:    '管理员密码不能为空'
                }
            ],

            placeholder:    '请输入管理员密码'
        },

        rePassword: {
            label:          '请确认密码',
            name:           'adminRePassword',
            placeholder:    '请再输入一次密码'
        }
    }
};

// 添加到集群
export const addToCluster = {
    url: {
        label:  '集群服务器URL',
        name:   'appServerUrl',
        rules:  [
            {
                required:   true,
                message:    '集群服务器URL不能为空'
            }
        ],
        placeholder: 'http://192.168.0.1:5757'
    },

    adminName: {
        label:  '管理员账号',
        name:   'adminName',
        rules: [
            {
                required:   true,
                message:    '管理员账号不能为空'
            }
        ],
        placeholder:    '请输入管理员账号'
    },

    password: {
        label:  '管理员密码',
        name:   'password',
        rules: [
            {
                required:   true,
                message:    '管理员密码不能为空'
            }
        ],
        placeholder:    '请输入管理员密码'
    }
};