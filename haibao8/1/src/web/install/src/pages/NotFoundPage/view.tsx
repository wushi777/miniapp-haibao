import React                from 'react';
import { connect }          from 'react-redux';

import * as Utils           from '../../utils';
import * as Common          from '../../common';

import { Button, Divider }  from 'antd';

import * as ActionTypes     from './actionTypes';
import * as Reducer         from './reducer';

import './style.less';

interface NotFoundProps extends Reducer.NotFoundStates {}

class NotFoundPage extends React.Component<NotFoundProps, any> {
    constructor(props: NotFoundProps) {
        super(props);  
        
        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        return (
            <div className="NoFoundPagecont">
                <div className="NoFoundImg" />
                <div className="NoFoundText">
                    <Divider>错误</Divider>
                    <h3>
                        哎呀，您想要找的页面找不到了！
                    </h3>
                    <div className="NoFoundBtn">
                        <Button onClick={this.handleBackHome}>返回安装页面</Button>
                    </div>
                </div> 
            </div>
        );
    }
    
    // 返回首页
    private handleBackHome() {
        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.install.path}`;
        Common.CommonFuncs.gotoPage(path, {});
    }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events = {};

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFoundPage);