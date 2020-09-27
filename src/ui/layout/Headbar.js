import React from 'react';
import { Row, Col } from 'antd';

/*import {
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';*/

// import axios from 'axios'
import AddressConn from '../components/AddressConn'

const Headbar = (props) => {

    return (
          <Row className="wallet" align="middle">
            <Col xs={6}>
              {/*<div className="btn">
                OPEN
              </div>*/}
            </Col>
            <Col xs={6}>
              {/*<Switch
                checkedChildren={<StarOutlined />}
                unCheckedChildren={<StarFilled />}
                defaultChecked
              />*/}
            </Col>
            <Col xs={12} className="ontop">
              <AddressConn />
            </Col>
          </Row>
    )
}

export default Headbar
