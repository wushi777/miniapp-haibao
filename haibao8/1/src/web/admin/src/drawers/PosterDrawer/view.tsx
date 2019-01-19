import React                    from 'react';
import { connect }              from 'react-redux';
import { FormComponentProps }   from 'antd/lib/form';

import * as Common              from '../../common';
import * as Utils               from '../../utils';
import * as Components          from '../../components';
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

interface PosterDrawerEvents {
    onChangeState:      (params: Reducer.PosterDrawChangeStates) => void;

    onGetUploadFileUrl: () => void;

    onCreatePoster: (
        posterCatIDs:   number[],
        posterName:     string, 
        posterDesc:     string, 
        posterData:     string, 
        posterUrl:      string
        // thumbUrl:       string
    ) => void;

    onModifyPoster:   (
        posterID:   number, 
        params:     Utils.ApiTypes.PosterEditableInfo
    ) => void;
}

interface FormValues {
    posterName:     string;
    posterDesc:     string;
    posterData:     string;
}

interface PosterDrawerProps extends FormComponentProps, Reducer.PosterDrawerStates, PosterDrawerEvents {
    drawerViewStatus:   number;
    poster:             Utils.ApiTypes.PosterInfo | null;

    onClose:            (e?: any, createdOrModified?: boolean) => void;
}

class PosterDrawer extends React.Component<PosterDrawerProps, any> {
    private tempPoster: Utils.ApiTypes.PosterInfo;

    constructor(props: PosterDrawerProps) {
        super(props);

        this.initTempPoster();

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

        if (this.props.createPosterResult) {
            Utils.umessage.success('创建海报成功');
            this.props.onChangeState({ createPosterResult: null });

            this.props.onClose(null, true);
        }

        if (this.props.modifyPosterResult) {
            Utils.umessage.success('修改海报成功');
            this.props.onChangeState({ modifyPosterResult: null });

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

    private initTempPoster(): void {
        if (this.props.poster) {
            this.tempPoster = Common.CommonFuncs.deepCopy(this.props.poster);
        } else {
            this.tempPoster = {
                posterID:           0,
                posterCatIDs:       [],
                posterName:         '',
                posterDesc:         '',
                posterData:         '',
                posterUrl:          '',
                // thumbUrl:           '',  
                viewTimes:          0,  
                createDate:         0,
                createDateObj:      new Date(0)
            };
        }
    }

    // 渲染标题
    private renderTitle(): string {
        return this.tempPoster.posterID ? '修改海报' : '添加海报';
    }

    // 渲染界面内容
    private renderContentView(): React.ReactNode {
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                <Form.Item label="海报名称">
                    {this.props.form.getFieldDecorator('posterName', {
                        // rules:          [Consts.PosterMgrForm.posterRules[0], { validator: this.validatePosterName }],
                        initialValue:   this.props.poster ? this.props.poster.posterName : ''
                    })(
                        <Input placeholder="请输入海报名称"/>
                    )}
                </Form.Item>

                <Form.Item label="海报描述">
                    {this.props.form.getFieldDecorator('posterDesc', {
                        // rules:          Consts.PosterMgrForm.realRules,
                        initialValue:   this.props.poster ? this.props.poster.posterDesc : ''
                    })(
                        <Input placeholder="请输入海报描述"/>
                    )}
                </Form.Item>

                <Form.Item label="海报数据">
                    {this.props.form.getFieldDecorator('posterData', {
                        // rules:          Consts.PosterMgrForm.realRules,
                        initialValue:   this.props.poster ? this.props.poster.posterData : ''
                    })(
                        <Input.TextArea rows={8} placeholder="请输入海报数据" />
                    )}
                </Form.Item>

                <Form.Item label="海报图片">
                    <Upload
                        name="posterUrl"
                        accept="image/jpeg, image/png, image/gif"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={this.props.getUploadUrlResult}
                        beforeUpload={this.handleBeforeUpload}
                        onChange={this.handleUploadPosterPicture}
                    >
                        <div>
                            {this.renderPosterPictureUrl()}
                            <Icon type={this.props.posterPictureUploading ? 'loading' : 'plus'} />
                            <div className="ant-upload-text">上传海报图片</div>
                        </div>
                    </Upload>
                </Form.Item>

                {/* <Form.Item label="缩略图">
                    <Upload
                        name="thumbUrl"
                        accept="image/jpeg, image/png, image/gif"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={this.props.getUploadUrlResult}
                        beforeUpload={this.handleBeforeUpload}
                        onChange={this.handleUploadPosterThumb}
                    >
                        <div>
                            {this.renderPosterThumbUrl()}
                            <Icon type={this.props.posterThumbUploading ? 'loading' : 'plus'} />
                            <div className="ant-upload-text">上传缩略图</div>
                        </div>
                    </Upload>
                </Form.Item> */}

                <Form.Item label="所属分类" key="posterCatIDs">
                    <Components.PosterCatMultipleSelect
                        posterCatIDs={this.props.poster ? this.props.poster.posterCatIDs : []}
                        onChange={this.handlePosterCatSelectChange}
                    />
                </Form.Item>

                <div className="buttons">
                    <Button 
                        type="primary" 
                        style={Consts.CancelButtonStyle} 
                        onClick={this.props.onClose}
                    >
                        取消
                    </Button>

                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={this.props.createPosterPending || this.props.modifyPosterPending}
                    >
                        提交
                    </Button>
                </div>
            </Form>
        );
    }

    private handlePosterCatSelectChange(posterCatIDs: number[]): void {
        this.tempPoster.posterCatIDs = posterCatIDs;
    }

    // 渲染海报图片
    private renderPosterPictureUrl(): React.ReactNode {
        return (
            <div className="updataImg">
                <img src={this.tempPoster.posterUrl} />
            </div>
        );
    }

    // // 渲染海报图片
    // private renderPosterThumbUrl(): React.ReactNode {
    //     return (
    //         <div className="updataImg">
    //             <img src={this.tempPoster.thumbUrl} />
    //         </div>
    //     );
    // }

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
    private handleUploadPosterPicture(info: any): void {
        if (info.file.status === 'uploading') {
            this.props.onChangeState({ 
                posterPictureUploading: true 
            });
        }

        if (info.file.status === 'done') {
            const uploadResult: any = info.file.response.result.posterUrl[0];

            this.tempPoster.posterUrl = uploadResult.path;

            this.props.onChangeState({
                posterPictureUploading:  false
            });
        }
    }

    // // 上传缩略图
    // private handleUploadPosterThumb(info: any): void {
    //     if (info.file.status === 'uploading') {
    //         this.props.onChangeState({ 
    //             posterThumbUploading: true 
    //         });
    //     }

    //     if (info.file.status === 'done') {
    //         const uploadResult: any = info.file.response.result.thumbUrl[0];

    //         this.tempPoster.thumbUrl = uploadResult.path;

    //         this.props.onChangeState({
    //             posterThumbUploading:  false
    //         });
    //     }
    // }

    // 提交表单
    private handleSubmit(e: any): void {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: FormValues) => {
            if (!err) {
                const { posterName, posterDesc, posterData }            = values;
                const { posterID, posterCatIDs, posterUrl /*, thumbUrl */ }   = this.tempPoster;

                if (posterID) {
                    // 修改
                    const params: Utils.ApiTypes.PosterEditableInfo = {
                        posterCatIDs,
                        posterName,
                        posterDesc,
                        posterData,
                        posterUrl,
                        // thumbUrl                        
                    };

                    this.props.onModifyPoster(posterID, params);
                } else {
                    // 添加
                    this.props.onCreatePoster(
                        posterCatIDs, 
                        posterName, 
                        posterDesc, 
                        posterData, 
                        posterUrl 
                        // thumbUrl
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

const mapDispatchToProps = (dispatch: any): PosterDrawerEvents => {
    const events: PosterDrawerEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onGetUploadFileUrl(): void {
            const action = Actions.getUploadFileUrl();
            dispatch(action);
        },

        onCreatePoster: (
            posterCatIDs:   number[],
            posterName:     string, 
            posterDesc:     string, 
            posterData:     string, 
            posterUrl:      string
            // thumbUrl:       string
        ): void => {
            const action = Actions.createPoster(
                posterCatIDs, posterName, posterDesc, posterData, posterUrl /* , thumbUrl */ );
                
            dispatch(action);
        },

        onModifyPoster: (posterID: number, params: any): void => {
            const action = Actions.modifyPoster(posterID, params);
            dispatch(action);
        }
    };

    return events;
};

const WrappedPosterDrawer = dynMountReducer(
    Form.create()(PosterDrawer), 
    ActionTypes.stateKey, 
    Reducer.reducer, 
    Reducer.initialState
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPosterDrawer);