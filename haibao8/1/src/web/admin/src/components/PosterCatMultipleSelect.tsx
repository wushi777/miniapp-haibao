import React        from 'react';

import * as Common  from '../common';
import * as Utils   from '../utils';

import { Select }   from 'antd';

interface PosterCatMultipleSelectProps {
    posterCatIDs?:  number[]; 
    onChange?:      (posterCatIDs: number[]) => void;
}

interface PosterCatMultipleSelectStates {
    posterCatPageData:    Utils.ApiTypes.PosterCatPageData | null;
}

export class PosterCatMultipleSelect extends React.Component<PosterCatMultipleSelectProps, PosterCatMultipleSelectStates> {
    constructor(props: PosterCatMultipleSelectProps) {
        super(props);

        this.state = {
            posterCatPageData: null
        };

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }
    
    public async componentDidMount(): Promise<void> {
        const posterCatPageData: Utils.ApiTypes.PosterCatPageData = await Utils.http.posterCatsApi.queryPosterCatPageData(
            '', Utils.ApiTypes.OrderNumFieldName, false, 0, 0);

        if (posterCatPageData.data.length > 0) {
            posterCatPageData.data.forEach((item: Utils.ApiTypes.PosterCatInfo) => {
                item.posterCatName = `${item.posterCatID} - ${item.posterCatName}`;
            });
        }

        this.setState({
            posterCatPageData
        });
    }

    public render() {
        const posterCats: Utils.ApiTypes.PosterCatInfo[] = this.state.posterCatPageData ? this.state.posterCatPageData.data : [];

        const options: React.ReactNode = posterCats.map((item: Utils.ApiTypes.PosterCatInfo) => {
            return (
                <Select.Option 
                    key={item.posterCatID} 
                    value={item.posterCatID} 
                    title={item.posterCatName}
                >
                    {item.posterCatName}
                </Select.Option>
            );
        });

        return (
            <Select
                mode="multiple"
                placeholder="请选择分类"
                notFoundContent="暂无分类"
                defaultValue={this.props.posterCatIDs}
                onChange={this.handleSelectChange}
            >
                {options}
            </Select>
        );
    }

    private handleSelectChange(value: number[]) {
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
}