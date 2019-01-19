import React            from 'react';
import { connect }      from 'react-redux';
import { Link }         from 'react-router';

import * as Utils       from '../../utils';
import * as Common      from '../../common';

import * as Actions     from './actions';
import * as Consts      from './consts';
import * as ActionTypes from './actionTypes';
import * as Reducer     from './reducer';

import { 
    Icon, 
    Layout, 
    Menu 
} from 'antd';

import './style.less';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

const siderStyle = {
    height: window.innerHeight
};

interface SideBarEvents {
    onChangeState: (params: {}) => void;
}

interface SideBarProps extends Reducer.SideBarStates, SideBarEvents {
    collapsed:      boolean;
    pathname:       string;
    openedSubMenu:  string[];

    onClick:        (key: string) => void;
    onOpenSubmenu:  (openSubmenu: string[]) => void;
}

class SideBar extends React.PureComponent<SideBarProps, {}> {
    constructor(props: SideBarProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render() {
        return (
            <Sider style={siderStyle} trigger={null} collapsible={true} collapsed={this.props.collapsed}>
                <h3>
                    {Utils.storage.adminName}
                </h3>
                <Menu
                    theme="dark"
                    selectedKeys={[this.props.pathname]}
                    openKeys={this.props.openedSubMenu}
                    mode="inline"
                    onClick={this.handleClick}
                    onOpenChange={this.handleOpenChange}
                >
                    {Consts.menus.map(item => this.renderMenuItem(item))}
                </Menu>
            </Sider>
        );
    }

    private handleClick(params: any): void {
        this.props.onClick(params.key);
    }

    private handleOpenChange(openKeys: string[]) {
        this.props.onOpenSubmenu(openKeys.slice(openKeys.length - 1, openKeys.length));
    }
    
    private renderMenuItem(data: any): any {
        if (data.sub) {
            const subTitle = (
                <span>
                    <Icon type={data.iconType} />
                    <span>{data.title}</span>
                </span>
            );

            return (
                <SubMenu key={data.key} title={subTitle}>
                    {data.sub.map((item) => this.renderMenuItem(item))}
                </SubMenu>
            );
        } else {
            return (
                <Menu.Item key={data.linkTo}>
                    <Link to={data.linkTo}>
                        <Icon type={data.iconType} />
                        <span>{data.title}</span>
                    </Link>
                </Menu.Item>
            );
        }
    }
}

const mapStateToProps = (state: Reducer.SideBarStates, ownProps: SideBarProps) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey, ownProps);
    return props;
};

const mapDispatchToProps = (dispatch: any): SideBarEvents => {
    const events: SideBarEvents = {
        onChangeState: (params) => {
            const action = Actions.changeState(params);
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);