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
    Upload, 
    Icon 
} from 'antd';

import './style.less';

interface ShopSlideDrawerEvents {
    onChangeState: (params: Reducer.ShopSlideChangeStates) => void;

    onGetUploadFileUrl: () => void;

    onCreateShopSlide: (
        shopSlideName:  string, 
        shopSlideDesc:  string, 
        shopSlideUrl:   string,
        shopSlideLink:  string,
        orderNum:       number
    ) => void;

    onModifyShopSlide: (
        shopSlideID:    number, 
        params:         Utils.ApiTypes.ShopSlideEditableInfo
    ) => void;
}

interface FormValues {
    shopSlideName:  string;
    shopSlideDesc:  string;
    shopSlideLink:  string;
    orderNum:       number;
}

interface ShopSlideDrawerProps extends FormComponentProps, Reducer.ShopSlideDrawerStates, ShopSlideDrawerEvents {
    shopSlide:  Utils.ApiTypes.ShopSlideInfo | null;

    onClose?:   (e?: any, createdOrModified?: boolean) => void;
}

class ShopSlideDrawer extends React.Component<ShopSlideDrawerProps, any> {
    private tempShopSlide: Utils.ApiTypes.ShopSlideInfo;

    constructor(props: ShopSlideDrawerProps) {
        super(props);

        this.initTempShopSlide();

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidMount(): void {
        this.props.onGetUploadFileUrl();
    }

    public componentDidUpdate(): void {
        if (this.props.error) {
            Utils.umessage.error(this.props.error.message);

            this.props.onChangeState({error: null});
        }

        if (this.props.createShopSlideResult) {
            Utils.umessage.success('创建成功');

            this.props.onChangeState({ 
                createShopSlideResult: null 
            });

            if (this.props.onClose) {
                this.props.onClose(null, true);
            }
        }

        if (this.props.modifyShopSlideResult) {
            Utils.umessage.success('修改成功');

            this.props.onChangeState({ 
                modifyShopSlideResult: null 
            });

            if (this.props.onClose) {
                this.props.onClose(null, true);
            }
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

    private initTempShopSlide(): void {
        if (this.props.shopSlide) {
            this.tempShopSlide = Common.CommonFuncs.deepCopy(this.props.shopSlide);
        } else {
            this.tempShopSlide = {
                shopSlideID:    0,
                shopSlideName:  '',
                shopSlideDesc:  '',
                shopSlideUrl:   '',
                shopSlideLink:  '',
                orderNum:       0
            };
        }
    }

    // 渲染标题
    private renderTitle(): string {
        return this.tempShopSlide.shopSlideID ? '修改轮播' : '添加轮播';
    }

    // 渲染界面内容
    private renderContentView(): React.ReactNode {
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                <Form.Item label="名称">
                    {this.props.form.getFieldDecorator('shopSlideName', {
                        // rules:          [Consts.ShopMgrForm.shopRules[0], { validator: this.validateShopName }],
                        initialValue:   this.props.shopSlide ? this.props.shopSlide.shopSlideName : ''
                    })(
                        <Input placeholder="请输入名称"/>
                    )}
                </Form.Item>

                <Form.Item label="描述">
                    {this.props.form.getFieldDecorator('shopSlideDesc', {
                        // rules:          Consts.ShopMgrForm.realRules,
                        initialValue:   this.props.shopSlide ? this.props.shopSlide.shopSlideDesc : ''
                    })(
                        <Input placeholder="请输入描述"/>
                    )}
                </Form.Item>

                <Form.Item label="图片">
                    <Upload
                        name="shopSlideUrl"
                        accept="image/jpeg, image/png, image/gif"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={this.props.getUploadUrlResult}
                        beforeUpload={this.HandleBeforeUpload}
                        onChange={this.handleUpload}
                    >
                        <div>
                            {this.renderShopSlideUrl()}
                            <Icon type={this.props.shopSlideUploading ? 'loading' : 'plus'} />
                            <div className="ant-upload-text">上传图片</div>
                        </div>
                    </Upload>
                </Form.Item>

                <Form.Item label="链接到">
                    {this.props.form.getFieldDecorator('shopSlideLink', {
                        // rules:          Consts.PosterMgrForm.realRules,
                        initialValue:   this.props.shopSlide ? this.props.shopSlide.shopSlideLink : ''
                    })(
                        <Input placeholder="请输入描述"/>
                    )}
                </Form.Item>

                <Form.Item label="排序数">
                    {this.props.form.getFieldDecorator('orderNum', {
                        // rules:          Consts.ShopMgrForm.realRules,
                        initialValue:   this.props.shopSlide ? this.props.shopSlide.orderNum : 0
                    })(
                        <Input placeholder="请输入排序数"/>
                    )}
                </Form.Item>

                <div className="buttons">
                    <Button type="primary" style={Consts.CancelButtonStyle} onClick={this.props.onClose}>取消</Button>
                    <Button type="primary" htmlType="submit" loading={this.props.createShopSlidePending || this.props.modifyShopSlidePending}>提交</Button>
                </div>
            </Form>
        );
    }

    // 渲染海报图片
    private renderShopSlideUrl(): React.ReactNode {
        return (
            <div className="updataImg">
                <img src={this.tempShopSlide.shopSlideUrl} />
            </div>
        );
    }

    // 验证文件类型和大小
    private HandleBeforeUpload(file: File): boolean {
        const isPicture = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif');

        if (!isPicture) {
            Utils.umessage.error('只能上传JPG/PNG/GIF图片文件！');
            return false;
        }

        // const isLt1M = file.size / 1024 / 1024 < 1;

        // if (!isLt1M) {
        //     Utils.umessage.error('文件不能超过1M！');
        //     return false;
        // }

        return true;
    }

    // 上传海报图片
    private handleUpload(info: any): void {
        if (info.file.status === 'uploading') {
            this.props.onChangeState({ 
                shopSlideUploading: true 
            });
        }

        if (info.file.status === 'done') {
            const uploadResult: any = info.file.response.result.shopSlideUrl[0];

            this.tempShopSlide.shopSlideUrl = uploadResult.path;

            this.props.onChangeState({
                shopSlideUploading:  false
            });
        }
    }

    // 提交表单
    private handleSubmit(e: any): void {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: FormValues) => {
            if (!err) {
                const { shopSlideName, shopSlideDesc, shopSlideLink, orderNum } = values;

                const { shopSlideID, shopSlideUrl } = this.tempShopSlide;

                if (shopSlideID) {
                    const params: Utils.ApiTypes.ShopSlideEditableInfo = {
                        shopSlideName,
                        shopSlideDesc,
                        shopSlideUrl,
                        shopSlideLink,
                        orderNum
                    };

                    this.props.onModifyShopSlide(shopSlideID, params);
                } else {
                    this.props.onCreateShopSlide(
                        shopSlideName, 
                        shopSlideDesc, 
                        shopSlideUrl, 
                        shopSlideLink, 
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

const mapDispatchToProps = (dispatch: any): ShopSlideDrawerEvents => {
    const events: ShopSlideDrawerEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onGetUploadFileUrl(): void {
            const action = Actions.getUploadFileUrl();
            dispatch(action);
        },

        onCreateShopSlide: (
            shopSlideName:    string, 
            shopSlideDesc:    string, 
            shopSlideUrl:     string, 
            shopSlideLink:    string,
            orderNum:           number
        ): void => {
            const action = Actions.createShopSlide(
                shopSlideName, shopSlideDesc, shopSlideUrl, shopSlideLink, orderNum);
                
            dispatch(action);
        },

        onModifyShopSlide: (
            shopSlideID:    number, 
            params:         Utils.ApiTypes.ShopSlideEditableInfo
        ): void => {
            const action = Actions.modifyShopSlide(shopSlideID, params);
            dispatch(action);
        }
    };

    return events;
};

const WrappedShopSlideDrawer = dynMountReducer(
    Form.create()(ShopSlideDrawer), 
    ActionTypes.stateKey, 
    Reducer.reducer, 
    Reducer.initialState
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedShopSlideDrawer);