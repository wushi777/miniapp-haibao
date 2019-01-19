import React        from 'react';
import ReactDOM     from 'react-dom';

import { Routes }   from './router';

import './index.less'; // 导入全局样式

const startApp = async () => {
    ReactDOM.render(
        <Routes />,
        document.getElementById('root')
    );
};

startApp();
