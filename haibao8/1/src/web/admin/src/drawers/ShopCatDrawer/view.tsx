import React                    from 'react';
import { connect }              from 'react-redux';
import { FormComponentProps }   from 'antd/lib/form';

import * as Common              from '../../common';
import * as Utils               from '../../utils';
import { dynMountReducer }      from '../../store';

import * as Actions             from './actions';
import * as ActionTypes         from './actionTypes';
import * as Reducer             from './reducer';
import * as Consts              from './consts';

import { 
    Button, 
    Drawer, 
    Form, 
    Input, 
    Checkbox 
}  from 'antd';

import './style.less';

interface ShopCatDrawerEvents {
    onChangeState: (params: Reducer.ShopCatChangeStates) => void;

    onCreateShopCat: (
        shopCatName:    string, 
        shopCatDesc:    string,
        hotspot:        boolean,
        orderNum:       number
    ) => void;

    onModifyShopCat: (
        shopID: number, 
        params: Utils.ApiTypes.ShopCatEditableInfo
    ) => void;
}

interface FormValues {
    shopCatName:    string;
    shopCatDesc:    string;
    hotspot:        boolean;
    orderNum:       number;
}

interface ShopCatDrawerProps extends FormComponentProps, Reducer.ShopCatDrawerStates, ShopCatDrawerEvents {
    shopCat:    Utils.ApiTypes.ShopCatInfo | null;

    onClose:    (e?: any, createdOrModified?: boolean) => void;
}

class ShopCatDrawer extends React.Component<ShopCatDrawerProps, any> {
    private tempShopCat: Utils.ApiTypes.ShopCatInfo;

    constructor(props: ShopCatDrawerProps) {
        super(props);

        this.initTempShopCat();

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidUpdate(): void {
        if (this.props.error) {
            Utils.umessage.error(this.props.error.message);
            this.props.onChangeState({error: null});
        }

        if (this.props.createShopCatResult) {
            Utils.umessage.success('创建分类成功');

            this.props.onChangeState({ 
                createShopCatResult: null 
            });

            this.props.onClose(null, true);
        }

        if (this.props.modifyShopCatResult) {
            Utils.umessage.success('修改分类成功');

            this.props.onChangeState({ 
                modifyShopCatResult: null 
            });

            this.props.onClose(null, true);
        }
    }

    public render(): React.ReactNode {
        return (
            <Drawer
                title={this.renderTitle()}
                width={720}
                placement="right"
                onClose={this.props.onClose}
                visible={true}
                style={Consts.DrawerStyle}
            >
                {this.renderContentView()}
            </Drawer>
        );
    }

    private initTempShopCat(): void {
        if (this.props.shopCat) {
            this.tempShopCat = Common.CommonFuncs.deepCopy(this.props.shopCat);
        } else {
            this.tempShopCat = {
                shopCatID:    0,
                shopCatName:  '',
                shopCatDesc:  '',
                hotspot:        false,
                orderNum:       0
            };
        }
    }

    // 渲染标题
    private renderTitle(): string {
        if (this.tempShopCat.shopCatID) {
            return '修改店铺分类';
        } else {
            return '添加店铺分类';
        }
    }

    // 渲染界面内容
    private renderContentView(): React.ReactNode {
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                <Form.Item label="分类名称">
                    {this.props.form.getFieldDecorator('shopCatName', {
                        initialValue:   this.props.shopCat ? this.props.shopCat.shopCatName : ''
                    })(
                        <Input placeholder="请输入分类名称"/>
                    )}
                </Form.Item>

                <Form.Item label="分类描述">
                    {this.props.form.getFieldDecorator('shopCatDesc', {
                        initialValue:   this.props.shopCat ? this.props.shopCat.shopCatDesc : ''
                    })(
                        <Input placeholder="请输入分类描述"/>
                    )}
                </Form.Item>

                <Form.Item label="选项">
                    {this.props.form.getFieldDecorator('hotspot', {
                        // initialValue:   this.props.shopCat ? this.props.shopCat.hotspot : false
                    })(
                        <Checkbox defaultChecked={this.props.shopCat ? this.props.shopCat.hotspot : false}>在热点位置显示</Checkbox>
                    )}
                </Form.Item>

                <Form.Item label="排序数">
                    {this.props.form.getFieldDecorator('orderNum', {
                        initialValue:   this.props.shopCat ? this.props.shopCat.orderNum : 0
                    })(
                        <Input placeholder="请输入排序数"/>
                    )}
                </Form.Item>

                <div className="buttons">
                    <Button type="primary" style={Consts.CancelButtonStyle} onClick={this.props.onClose}>取消</Button>
                    <Button type="primary" htmlType="submit" loading={this.props.createShopCatPending || this.props.modifyShopCatPending}>提交</Button>
                </div>
            </Form>
        );
    }

    // 提交表单
    private handleSubmit(e: any): void {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: FormValues) => {
            if (!err) {
                const { shopCatName, shopCatDesc, hotspot, orderNum } = values;

                if (this.tempShopCat.shopCatID) {
                    const params: Utils.ApiTypes.ShopCatEditableInfo = {
                        shopCatName,
                        shopCatDesc,
                        hotspot,
                        orderNum
                    };

                    this.props.onModifyShopCat(this.tempShopCat.shopCatID, params);
                } else {
                    this.props.onCreateShopCat(
                        shopCatName, 
                        shopCatDesc, 
                        hotspot, 
                        orderNum
                    );
                }
            }
        });
    }
}

const mapStateToProps = (state, ownProps) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey, ownProps);
    return props;
};

const mapDispatchToProps = (dispatch: any): ShopCatDrawerEvents => {
    const events: ShopCatDrawerEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onCreateShopCat: (
            shopCatName:    string, 
            shopCatDesc:    string,
            hotspot:        boolean,
            orderNum:       number
        ): void => {
            const action = Actions.createShopCat(shopCatName, shopCatDesc, hotspot, orderNum);
                
            dispatch(action);
        },

        onModifyShopCat: (shopCatID: number, params: Utils.ApiTypes.ShopCatEditableInfo): void => {
            const action = Actions.modifyShopCat(shopCatID, params);
            dispatch(action);
        }
    };

    return events;
};

const WrappedShopCatDrawer = dynMountReducer(
    Form.create()(ShopCatDrawer), 
    ActionTypes.stateKey, 
    Reducer.reducer, 
    Reducer.initialState
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedShopCatDrawer);