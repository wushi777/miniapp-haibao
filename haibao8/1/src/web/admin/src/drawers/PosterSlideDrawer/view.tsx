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

interface PosterSlideDrawerEvents {
    onChangeState:      (params: Reducer.PosterSlideChangeStates) => void;

    onGetUploadFileUrl: () => void;

    onCreatePosterSlide: (
        posterSlideName:    string, 
        posterSlideDesc:    string, 
        posterSlideUrl:     string,
        posterSlideLink:    string,
        orderNum:           number
    ) => void;

    onModifyPosterSlide: (
        posterSlideID: number, 
        params: Utils.ApiTypes.PosterSlideEditableInfo
    ) => void;
}

interface FormValues {
    posterSlideName:    string;
    posterSlideDesc:    string;
    posterSlideLink:    string;
    orderNum:           number;
}

interface PosterSlideDrawerProps extends FormComponentProps, Reducer.PosterSlideDrawerStates, PosterSlideDrawerEvents {
    posterSlide?:   Utils.ApiTypes.PosterSlideInfo | null;

    onClose?:       (e?: any, createdOrModified?: boolean) => void;
}

class PosterSlideDrawer extends React.Component<PosterSlideDrawerProps, any> {
    private tempPosterSlide: Utils.ApiTypes.PosterSlideInfo;

    constructor(props: PosterSlideDrawerProps) {
        super(props);

        this.initTempPosterSlide();

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

        if (this.props.createPosterSlideResult) {
            Utils.umessage.success('创建成功');

            this.props.onChangeState({ 
                createPosterSlideResult: null 
            });

            if (this.props.onClose) {
                this.props.onClose(null, true);
            }
        }

        if (this.props.modifyPosterSlideResult) {
            Utils.umessage.success('修改成功');

            this.props.onChangeState({ 
                modifyPosterSlideResult: null 
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

    private initTempPosterSlide(): void {
        if (this.props.posterSlide) {
            this.tempPosterSlide = Common.CommonFuncs.deepCopy(this.props.posterSlide);
        } else {
            this.tempPosterSlide = {
                posterSlideID:      0,
                posterSlideName:    '',
                posterSlideDesc:    '',
                posterSlideUrl:     '',
                posterSlideLink:    '',
                orderNum:           0
            };
        }
    }

    // 渲染标题
    private renderTitle(): string {
        return this.tempPosterSlide.posterSlideID ? '修改轮播' : '添加轮播';
    }

    // 渲染界面内容
    private renderContentView(): React.ReactNode {
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                <Form.Item label="名称">
                    {this.props.form.getFieldDecorator('posterSlideName', {
                        // rules:          [Consts.PosterMgrForm.posterRules[0], { validator: this.validatePosterName }],
                        initialValue:   this.props.posterSlide ? this.props.posterSlide.posterSlideName : ''
                    })(
                        <Input placeholder="请输入名称"/>
                    )}
                </Form.Item>

                <Form.Item label="描述">
                    {this.props.form.getFieldDecorator('posterSlideDesc', {
                        // rules:          Consts.PosterMgrForm.realRules,
                        initialValue:   this.props.posterSlide ? this.props.posterSlide.posterSlideDesc : ''
                    })(
                        <Input placeholder="请输入描述"/>
                    )}
                </Form.Item>

                <Form.Item label="图片">
                    <Upload
                        name="posterSlideUrl"
                        accept="image/jpeg, image/png, image/gif"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={this.props.getUploadUrlResult}
                        beforeUpload={this.handleBeforeUpload}
                        onChange={this.handleUploadChange}
                    >
                        <div>
                            {this.renderPosterSlideUrl()}
                            <Icon type={this.props.posterSlideUploading ? 'loading' : 'plus'} />
                            <div className="ant-upload-text">上传图片</div>
                        </div>
                    </Upload>
                </Form.Item>

                <Form.Item label="链接到">
                    {this.props.form.getFieldDecorator('posterSlideLink', {
                        // rules:          Consts.PosterMgrForm.realRules,
                        initialValue:   this.props.posterSlide ? this.props.posterSlide.posterSlideLink : ''
                    })(
                        <Input placeholder="请输入描述"/>
                    )}
                </Form.Item>

                <Form.Item label="排序数">
                    {this.props.form.getFieldDecorator('orderNum', {
                        // rules:          Consts.PosterMgrForm.realRules,
                        initialValue:   this.props.posterSlide ? this.props.posterSlide.orderNum : 0
                    })(
                        <Input placeholder="请输入排序数"/>
                    )}
                </Form.Item>

                <div className="buttons">
                    <Button type="primary" style={Consts.CancelButtonStyle} onClick={this.props.onClose}>取消</Button>
                    <Button type="primary" htmlType="submit" loading={this.props.createPosterSlidePending || this.props.modifyPosterSlidePending}>提交</Button>
                </div>
            </Form>
        );
    }

    // 渲染海报图片
    private renderPosterSlideUrl(): React.ReactNode {
        return (
            <div className="updataImg">
                <img src={this.tempPosterSlide.posterSlideUrl} />
            </div>
        );
    }

    // 验证文件类型和大小
    private handleBeforeUpload(file: File): boolean {
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
    private handleUploadChange(info: any): void {
        if (info.file.status === 'uploading') {
            this.props.onChangeState({ 
                posterSlideUploading: true 
            });
        }

        if (info.file.status === 'done') {
            const uploadResult: any = info.file.response.result.posterSlideUrl[0];

            this.tempPosterSlide.posterSlideUrl = uploadResult.path;

            this.props.onChangeState({
                posterSlideUploading:  false
            });
        }
    }

    // 提交表单
    private handleSubmit(e: any): void {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: FormValues) => {
            if (!err) {
                const { posterSlideName, posterSlideDesc, posterSlideLink, orderNum } = values;

                const posterSlideID:    number = this.tempPosterSlide.posterSlideID;
                const posterSlideUrl:   string = this.tempPosterSlide.posterSlideUrl;

                if (posterSlideID) {
                    const params: Utils.ApiTypes.PosterSlideEditableInfo = {
                        posterSlideName,
                        posterSlideDesc,
                        posterSlideUrl,
                        posterSlideLink,
                        orderNum
                    };

                    this.props.onModifyPosterSlide(posterSlideID, params);
                } else {
                    this.props.onCreatePosterSlide(
                        posterSlideName, 
                        posterSlideDesc, 
                        posterSlideUrl, 
                        posterSlideLink, 
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

const mapDispatchToProps = (dispatch: any): PosterSlideDrawerEvents => {
    const events: PosterSlideDrawerEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onGetUploadFileUrl(): void {
            const action = Actions.getUploadFileUrl();
            dispatch(action);
        },

        onCreatePosterSlide: (
            posterSlideName:    string, 
            posterSlideDesc:    string, 
            posterSlideUrl:     string, 
            posterSlideLink:    string,
            orderNum:           number
        ): void => {
            const action = Actions.createPosterSlide(
                posterSlideName, posterSlideDesc, posterSlideUrl, posterSlideLink, orderNum);
                
            dispatch(action);
        },

        onModifyPosterSlide: (
            posterSlideID:  number, 
            params:         Utils.ApiTypes.PosterSlideEditableInfo
        ): void => {
            const action = Actions.modifyPosterSlide(posterSlideID, params);
            dispatch(action);
        }
    };

    return events;
};

const WrappedPosterSlideDrawer = dynMountReducer(
    Form.create()(PosterSlideDrawer), 
    ActionTypes.stateKey, 
    Reducer.reducer, 
    Reducer.initialState
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPosterSlideDrawer);