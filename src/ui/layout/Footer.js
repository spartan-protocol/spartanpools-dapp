import React from 'react'
import { Row, Col } from 'antd'

import AddressConn from '../components/AddressConn'
import { useWindowSize } from '../components/common'

const Footer = (props) => {

  const size = useWindowSize();
  const width = size.width;

    return (
      <div style={{ position:"fixed", right:"0", bottom:"0" }}>
      { width < 768 &&
        <Row>
          <Col xs={24} md={0} style={{ textAlign: 'right' }}>
            <AddressConn />
          </Col>
        </Row>
      }
      </div>
    )

}

export default Footer
