import React        from 'react';
import { Layout }   from 'antd';

import * as Consts  from './consts';

const { Content } = Layout;

export class Root extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Layout style={Consts.layoutStyle}>
                    <Layout>
                        <Content>  
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default Root;