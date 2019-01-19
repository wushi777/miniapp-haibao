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

interface PosterCatDrawerEvents {
    onChangeState: (params: Reducer.PosterCatChangeStates) => void;

    onCreatePosterCat: (
        posterCatName:  string, 
        posterCatDesc:  string,
        hotspot:        boolean,
        orderNum:       number
    ) => void;

    onModifyPosterCat: (
        posterID:   number, 
        params:     Utils.ApiTypes.PosterCatEditableInfo
    ) => void;
}

interface FormValues {
    posterCatName:  string;
    posterCatDesc:  string;
    hotspot:        boolean;
    orderNum:       number;
}

interface PosterCatDrawerProps extends FormComponentProps, Reducer.PosterCatDrawerStates, PosterCatDrawerEvents {
    posterCat:  Utils.ApiTypes.PosterCatInfo | null;

    onClose:    (e?: any, createdOrModified?: boolean) => void;
}

class PosterCatDrawer extends React.Component<PosterCatDrawerProps, any> {
    private tempPosterCat: Utils.ApiTypes.PosterCatInfo;

    constructor(props: PosterCatDrawerProps) {
        super(props);

        this.initTempPosterCat();

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidUpdate(): void {
        if (this.props.error) {
            Utils.umessage.error(this.props.error.message);

            this.props.onChangeState({error: null});
        }

        if (this.props.createPosterCatResult) {
            Utils.umessage.success('创建分类成功');

            this.props.onChangeState({ 
                createPosterCatResult: null 
            });

            this.props.onClose(null, true);
        }

        if (this.props.modifyPosterCatResult) {
            Utils.umessage.success('修改分类成功');

            this.props.onChangeState({ 
                modifyPosterCatResult: null 
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

    private initTempPosterCat(): void {
        if (this.props.posterCat) {
            this.tempPosterCat = Common.CommonFuncs.deepCopy(this.props.posterCat);
        } else {
            this.tempPosterCat = {
                posterCatID:    0,
                posterCatName:  '',
                posterCatDesc:  '',
                hotspot:        false,
                orderNum:       0
            };
        }
    }

    // 渲染标题
    private renderTitle(): string {
        if (this.tempPosterCat.posterCatID) {
            return '修改海报分类';
        } else {
            return '添加海报分类';
        }
    }

    // 渲染界面内容
    private renderContentView(): React.ReactNode {
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                <Form.Item label="分类名称">
                    {this.props.form.getFieldDecorator('posterCatName', {
                        initialValue:   this.props.posterCat ? this.props.posterCat.posterCatName : ''
                    })(
                        <Input placeholder="请输入分类名称"/>
                    )}
                </Form.Item>

                <Form.Item label="分类描述">
                    {this.props.form.getFieldDecorator('posterCatDesc', {
                        initialValue:   this.props.posterCat ? this.props.posterCat.posterCatDesc : ''
                    })(
                        <Input placeholder="请输入分类描述"/>
                    )}
                </Form.Item>

                <Form.Item label="选项">
                    {this.props.form.getFieldDecorator('hotspot', {
                        // initialValue:   this.props.posterCat ? this.props.posterCat.hotspot : false
                    })(
                        <Checkbox defaultChecked={this.props.posterCat ? this.props.posterCat.hotspot : false}>在热点位置显示</Checkbox>
                    )}
                </Form.Item>

                <Form.Item label="排序数">
                    {this.props.form.getFieldDecorator('orderNum', {
                        initialValue:   this.props.posterCat ? this.props.posterCat.orderNum : 0
                    })(
                        <Input placeholder="请输入排序数"/>
                    )}
                </Form.Item>

                <div className="buttons">
                    <Button type="primary" style={Consts.CancelButtonStyle} onClick={this.props.onClose}>取消</Button>
                    <Button type="primary" htmlType="submit" loading={this.props.createPosterCatPending || this.props.modifyPosterCatPending}>提交</Button>
                </div>
            </Form>
        );
    }

    // 提交表单
    private handleSubmit(e: any): void {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: FormValues) => {
            if (!err) {
                const { posterCatName, posterCatDesc, hotspot, orderNum } = values;

                if (this.tempPosterCat.posterCatID) {
                    const params: Utils.ApiTypes.PosterCatEditableInfo = {
                        posterCatName,
                        posterCatDesc,
                        hotspot,
                        orderNum
                    };

                    this.props.onModifyPosterCat(this.tempPosterCat.posterCatID, params);
                } else {
                    this.props.onCreatePosterCat(
                        posterCatName, 
                        posterCatDesc, 
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

const mapDispatchToProps = (dispatch: any): PosterCatDrawerEvents => {
    const events: PosterCatDrawerEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onCreatePosterCat: (
            posterCatName:  string, 
            posterCatDesc:  string,
            hotspot:        boolean,
            orderNum:       number
        ): void => {
            const action = Actions.createPosterCat(posterCatName, posterCatDesc, hotspot, orderNum);
                
            dispatch(action);
        },

        onModifyPosterCat: (posterCatID: number, params: Utils.ApiTypes.PosterCatEditableInfo): void => {
            const action = Actions.modifyPosterCat(posterCatID, params);
            dispatch(action);
        }
    };

    return events;
};

const WrappedPosterCatDrawer = dynMountReducer(
    Form.create()(PosterCatDrawer), 
    ActionTypes.stateKey, 
    Reducer.reducer, 
    Reducer.initialState
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPosterCatDrawer);