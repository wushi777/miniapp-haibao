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
    Row,
    Col
} from 'antd';

import './style.less';

interface ShopDrawerEvents {
    onChangeState: (params: Reducer.ShopChangeStates) => void;
    
    onReviewShop: (
        shopID:         number,
        reviewStatus:   Utils.ApiTypes.ReviewStatusEnum,
        rejectReason:   string
    ) => void;
}

interface ShopDrawerProps extends FormComponentProps, Reducer.ShopDrawerStates, ShopDrawerEvents {
    drawerViewStatus:   number;
    shop:               Utils.ApiTypes.ShopInfo | null;

    onClose?:           (e?: any, createdOrModified?: boolean) => void;
}

class ShopDrawer extends React.Component<ShopDrawerProps, any> {
    private tempShop: Utils.ApiTypes.ShopInfo;

    constructor(props: ShopDrawerProps) {
        super(props);

        this.initTempShop();

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidUpdate(): void {
        if (this.props.error) {
            Utils.umessage.error(this.props.error.message);

            this.props.onChangeState({
                error: null
            });
        }

        if (this.props.reviewShopResult) {
            Utils.umessage.success('审核完成');

            this.props.onChangeState({ 
                reviewShopResult: null 
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

    private initTempShop(): void {
        if (this.props.shop) {
            this.tempShop = Common.CommonFuncs.deepCopy(this.props.shop);
        } else {
            this.tempShop = {
                shopID:         0,
                accountID:      0,

                shopCatID:      0,
                shopName:       '',
                shopDesc:       '',
                phoneNumber:    '',
                shopAddress:    '',
                longitude:      0,
                latitude:       0,
                logoUrl:        '',
                shopDetail:     '',
                shopImages:     [],

                viewTimes:      0,

                reviewStatus:   Utils.ApiTypes.ReviewStatusEnum.srsAll,
                rejectReason:   '',

                createDate:     0,
                createDateObj:  new Date(0),

                modifyDate:     0,
                modifyDateObj:  new Date(0),

                reviewDate:     0,
                reviewDateObj:  new Date(0)
            };
        }
    }

    // 渲染标题
    private renderTitle(): string {
        return '审核店铺';
    }

    // 渲染界面内容
    private renderContentView(): React.ReactNode {
        return (
            <Form layout="vertical">
                <Row>
                    <Col span={5}>
                        <p>店铺名称:</p>
                    </Col>
                    <Col span={12}>
                        <span>{this.tempShop.shopName}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={5}>
                        <p>店铺描述:</p>
                    </Col>
                    <Col span={12}>
                        <span>{this.tempShop.shopDesc}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={5}>
                        <p>店铺地址:</p>
                    </Col>
                    <Col span={12}>
                        <span>{this.tempShop.shopAddress}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={5}>
                        <p>店铺Logo:</p>
                    </Col>
                    <Col span={12}>
                        <img src={this.tempShop.logoUrl}/>
                    </Col>
                </Row>

                <Form.Item label="拒绝原因">
                    <Input 
                        placeholder="拒绝原因" 
                        onChange={this.handleRejectReasonChange} 
                    />
                </Form.Item>

                <div className="buttons">
                    <Button 
                        type="primary" 
                        loading={this.props.reviewShopPending}
                        onClick={this.handleReviewReject}
                    >
                        拒绝
                    </Button>

                    <Button 
                        type="primary" 
                        loading={this.props.reviewShopPending}
                        onClick={this.handleReviewSuccess}
                    >
                        通过
                    </Button>
                </div>
            </Form>
        );
    }

    private handleRejectReasonChange(e: any): void {
        this.tempShop.rejectReason = JSON.stringify(e);
    }

    private handleReviewReject(): void {
        this.props.onReviewShop(
            this.tempShop.shopID, 
            Utils.ApiTypes.ReviewStatusEnum.srsReject, 
            this.tempShop.rejectReason
        );
    }

    private handleReviewSuccess(): void {
        this.props.onReviewShop(
            this.tempShop.shopID, 
            Utils.ApiTypes.ReviewStatusEnum.srsSuccess, 
            ''
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey, ownProps);
    return props;
};

const mapDispatchToProps = (dispatch: any): ShopDrawerEvents => {
    const events: ShopDrawerEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onReviewShop: (
            shopID:         number,
            reviewStatus:   Utils.ApiTypes.ReviewStatusEnum,
            rejectReason:   string
        ): void => {
            const action = Actions.reviewShop(shopID, reviewStatus, rejectReason);
            dispatch(action);
        }
    };

    return events;
};

const WrappedShopDrawer = dynMountReducer(
    Form.create()(ShopDrawer), 
    ActionTypes.stateKey, 
    Reducer.reducer, 
    Reducer.initialState
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedShopDrawer);