import { PaginationProps } from 'antd/lib/pagination';

export const initPagination = (): PaginationProps => {
    return {
        current:            0,
        pageSize:           20,
        total:              0,
        showQuickJumper:    true,
        showSizeChanger:    false,
        showTotal: (total: number, range: [number, number]) => {
            return `总条目: ${total} 条, 当前条目: ${range[0]} - ${range[1]}`;
        }
    };
};