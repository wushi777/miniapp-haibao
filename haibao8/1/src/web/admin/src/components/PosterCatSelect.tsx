import React        from 'react';

import * as Utils  from '../utils';
import * as Common from '../common';

interface PosterCatSelectProps {
    posterCatID?:       number;                         // 默认选中
    disabled?:          boolean;                        // 是否禁用
    onChangePosterCat?: (posterCatID: number) => void;    // 切换PosterCat回调函数
}

interface PosterCatSelectStates {
    posterCatPageData:    any;
}

const selectOptions: any = {
    key:                'posterCatID',
    name:               'posterCatName',
    placeholder:        `请选择分类`,
    notFoundContent:    `暂无分类`,
    style: {
        width:          '200px'
    }
};

export class PosterCatSelect extends React.Component<PosterCatSelectProps, PosterCatSelectStates> {
    constructor(props: PosterCatSelectProps) {
        super(props);

        this.state = {
            posterCatPageData: null
        };

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }
    
    public async componentDidMount(): Promise<void> {
        const posterCatPageData: Utils.ApiTypes.PosterCatPageData = await Utils.http.posterCatsApi.queryPosterCatPageData(
            '', 'orderNum', false, 0, 0);

        if (posterCatPageData.data.length > 0) {
            posterCatPageData.data.forEach((item: Utils.ApiTypes.PosterCatInfo) => {
                item.posterCatName = `${item.posterCatID} - ${item.posterCatName}`;
                // return item;
            });
        }

        this.setState({
            posterCatPageData
        });
    }

    public render() {
        return (
            <Common.MySelect
                data={this.state.posterCatPageData ? this.state.posterCatPageData.data : []}
                selectOptions={selectOptions}
                onChange={this.handleChangePosterCat}
                allowClear={false}
                disabled={false}
                value={Number(this.props.posterCatID) ? String(this.props.posterCatID) : undefined}
            />
        );
    }

    private handleChangePosterCat(posterCatID: any) {
        if (this.props.onChangePosterCat) {
            this.props.onChangePosterCat(posterCatID);
        }
    }
}