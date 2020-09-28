import React from 'react'
import { Row, Col } from 'antd';

// import axios from 'axios'
import AddressConn from '../components/AddressConn'

const Headbar = (props) => {

    return (
          <Row className="wallet ontop" align="middle">
            <Col xs={24}>
              <AddressConn />
            </Col>
          </Row>
    )
}

export default Headbar
