import React                    from 'react';
import { Icon, Layout, Spin }   from 'antd';

import * as Common              from '../common';
import * as Utils               from '../utils';

import * as Consts              from './consts';

import { view as SideBar }      from '../bars/SideBar';

const contentStyle = {
    margin:     '20px 16px 0px 16px',
    padding:    20,
    background: '#fff',
    minHeight:  280,
    height:     window.innerHeight - 88
};

// 此对象是用来判断展开哪一个一级菜单
export const SubMenuKeys = {
    'dosageMgr':            'transactionsMgr',
    'orderMgr':             'transactionsMgr',

    'posterSlides':         'postersMgr',
    'posterCats':           'postersMgr',
    'postersMgr':           'postersMgr',

    'shopSlides':           'shopsMgr',
    'shopsMgr':             'shopsMgr',

    'database':             'settings',
    'wxappConfigs':         'settings',
    'tencentCosConfigs':    'settings',
    'modifyPassword':       'settings',

    'wxpaySettings':        'pays',
    'alipaySettings':       'pays',
    'orderSubject':         'pays',
    'priceSettings':        'pays',
    'expMoneySettings':     'pays',
};

export class Root extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        
        this.state = {
            collapsed:      false,
            logoutLoading:  false,
            pathname:       location.pathname,
            openedSubMenu:  []
        };

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidMount(): void {
        this.initOpenedSubMenu();
    }

    public componentDidUpdate(): void {
        if (!Utils.storage.adminAccessToken) {
            if (this.state.pathname && this.state.pathname !== '/adminCenter') {
                this.setState({
                    pathname:       '/adminCenter',
                    openedSubMenu:  []
                });
            }
        }
    }

    public render(): React.ReactNode {
        if (Utils.storage.adminAccessToken) {
            return (
                <Spin spinning={this.state.logoutLoading} tip="正在退出" delay={500}>
                    <Layout style={Consts.layoutStyle}>
                        <SideBar
                            collapsed={this.state.collapsed}
                            pathname={this.state.pathname}
                            openedSubMenu={this.state.openedSubMenu}
                            onOpenSubmenu={this.handleOpenSubMenu}
                            onClick={this.handleClick}
                        />
                        <Layout>
                            <Layout.Header>
                                <Icon
                                    className="trigger"
                                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this.handleToggleSider}
                                />
                                <div className="userinfo">
                                    <span>{Utils.storage.adminName}</span>
                                    <Icon
                                        className="trigger"
                                        type="logout"
                                        onClick={this.handleLogout}
                                    />
                                </div>
                            </Layout.Header>
                            <Layout.Content style={contentStyle}>  
                                {this.props.children}
                            </Layout.Content>
                        </Layout>
                    </Layout>
                </Spin>
            );
        } else {
            return (
                <Layout style={Consts.layoutStyle}>
                    <Layout>
                        <Layout.Content>  
                            {this.props.children}
                        </Layout.Content>
                    </Layout>
                </Layout>
            );
        }
    }

    // 切换菜单
    private handleClick(): void {
        this.setState({
            pathname:   location.pathname
        });
    }

    // 初始化默认需要打开的一级菜单
    private initOpenedSubMenu(): void {
        if (this.state.pathname === Utils.routerRootPath) {
            this.setState({
                pathname: Utils.routerRootPath + Utils.routerPaths.adminCenter.path
            });
        } else {
            this.setState({
                pathname: this.state.pathname.split(Utils.routerRootPath).slice(0, 3).join(Utils.routerRootPath)
            });
        }

        if (process.env.NODE_ENV === 'production') {
            if (SubMenuKeys[this.state.pathname.split('/')[2]]) {
                this.setState({
                    openedSubMenu: ['/' + SubMenuKeys[this.state.pathname.split('/')[2]]]
                });
            }
        } else {
            if (SubMenuKeys[this.state.pathname.split(Utils.routerRootPath)[1]]) {
                this.setState({
                    openedSubMenu: ['/' + SubMenuKeys[this.state.pathname.split(Utils.routerRootPath)[1]]]
                });
            }
        }
    }

    // 打开一级菜单
    private handleOpenSubMenu(openedSubMenu: string[]): void {
        this.setState({
            openedSubMenu
        });
    }

    // 切换侧边栏显示隐藏
    private handleToggleSider(): void {
        this.setState({ collapsed: !this.state.collapsed });
    }

    // 退出登录
    private async handleLogout(): Promise<void> {
        this.setState({ logoutLoading: true });

        const logoutResult: boolean = await Utils.http.adminsApi.logout();

        this.setState({ logoutLoading: false });

        if (logoutResult) {
            Utils.storage.adminAccessToken    = '';
            Utils.storage.adminName           = '';

            const path: string = `${Utils.routerRootPath}${Utils.routerPaths.login.path}`;
            Common.CommonFuncs.gotoPage(path, {});
        }
    }
}

export default Root;