import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Breadcrumb, Button, Input, Dropdown, Menu, Divider } from 'antd'
import { DownOutlined, } from '@ant-design/icons';
// PlusCircleOutlined, MinusCircleOutlined, Tooltip
import {
  rainbowStop, getIntFromName,
  convertFromWei, formatUSD,
} from '../../utils'
import { paneStyles, colStyles } from '../components/styles'
import { getTokenSymbol } from '../../client/web3'
import { H1, HR, Colour, Text, Center, Label, Sublabel, LabelGroup } from '../components/elements'

export const BreadcrumbCombo = (props) => {

  return (
    <div>
      <H1>{props.title}</H1>
      <Breadcrumb>
        <Breadcrumb.Item><Link to={props.link}>{props.parent}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{props.child}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export const InputPane = (props) => {

  const styles = {
    marginLeft: 10
  }


  return (
    <div style={styles}>
      <Row>
        <Col xs={24}>
          <Input onChange={props.onInputChange}
            placeholder={convertFromWei(props.paneData?.input)}
            size={'large'}
            // defaultValue={convertFromWei(props.paneData?.input)}
            allowClear={true}
          // addonAfter={<TokenDropDown default={props.paneData?.address}
          //   changeToken={props.changeToken}
          //   tokenList={props.tokenList} />}
          ></Input>
          <Sublabel>Balance:
            {convertFromWei(props.paneData?.balance)} ({props.paneData?.symbol})</Sublabel>
        </Col>
      </Row>
      <PercentButtonRow changeAmount={props.changeAmount} />
    </div>
  )
}

export const InputPaneStatic = (props) => {
  //tokenList
  //paneData: {address, input, balance}
  //inputChange, changeToken, changeAmount
  const styles = {
    marginLeft: 10
  }
  return (
    <div style={styles}>
      <Row>
        <Col xs={24}>
          <Input onChange={props.onInputChange}
            placeholder={convertFromWei(props.paneData?.input)}
            // defaultValue={convertFromWei(props.paneData?.input)}
            allowClear={true}
            addonAfter={
              <TokenSymbol
                symbol={props.tokenSymbol?.symbol} />}
          ></Input>
          <Sublabel>Balance:
            {convertFromWei(props.paneData?.balance)} ({props.tokenSymbol?.symbol})</Sublabel>
        </Col>
      </Row>
      <PercentButtonRow changeAmount={props.changeAmount} />
    </div>
  )
}



export const OutputPane = (props) => {

  // const [secondToken, setSecondToken] = useState(false)

  // const handleSecondToken = () => {
  //   secondToken ? setSecondToken(false) : setSecondToken(true)
  // }

  return (
    <div style={{ margin: 0 }}>
      <Center>
        <Row>
          <Col xs={24}>
            <PercentButtonRow changeAmount={props.changeAmount} />
          </Col>
        </Row>
      </Center>
      {/* <Center>
        {!secondToken &&
          <div>
            <Row>
              <Col xs={18}>
                <TokenDropDown />
              </Col>
              <Col xs={6}>
                <Tooltip title="Withdraw simultaneously to a second token">
                  <Button style={{ marginLeft: 10 }} onClick={handleSecondToken} icon={<PlusCircleOutlined />}></Button>
                </Tooltip>
              </Col>
            </Row>
          </div>
        }
        {secondToken &&
          <div>
            <Row>
              <Col xs={8} style={{ marginLeft: 10 }}>
                <TokenDropDown />
              </Col>
              <Col xs={8} style={{ marginLeft: 10 }}>
                <TokenDropDown />
              </Col>
              <Col xs={4} style={{ marginLeft: 10 }}>
                <Button onClick={handleSecondToken} icon={<MinusCircleOutlined />}></Button>
              </Col>
            </Row>
          </div>
        }
      </Center> */}
      <br />
    </div >
  )
}

export const PercentButtonRow = (props) => {

  const change25 = () => { props.changeAmount(25) }
  const change50 = () => { props.changeAmount(50) }
  const change75 = () => { props.changeAmount(75) }
  const change100 = () => { props.changeAmount(100) }

  const btnStyle = {
    marginRight: 3.5,
    marginTop: 10,
  }
  return (
    <>
      <Row style={{ marginBottom: 10 }}>
        <Col xs={24}>
          <Button type="dashed" style={btnStyle} onClick={change25}>25%</Button>
          <Button type="dashed" style={btnStyle} onClick={change50}>50%</Button>
          <Button type="dashed" style={btnStyle} onClick={change75}>75%</Button>
          <Button style={btnStyle} onClick={change100}>ALL</Button>
        </Col>
      </Row>
    </>
  )
}

export const TokenDropDown = (props) => {

  const [symbol, setSymbol] = useState("SPARTA")
  const [arraySymbols, setArraySymbols] = useState(["SPARTA"])

  useEffect(() => {
    if (props.tokenList) {
      loadSymbols()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tokenList])

  const loadSymbols = async () => {
    setSymbol(await getTokenSymbol(props.default))
    const symbols = props.tokenList.map(async (item) => await getTokenSymbol(item))
    setArraySymbols(symbols)
  }

  const handleMenuClick = async (e) => {
    setSymbol(await getTokenSymbol(props.tokenList[e.key]))
    props.changeToken(props.tokenList[e.key])
  }

  const style = {
    width: 100,
    // background: Colour().white,
    // padding:'-20px'
  }

  const menu = (
    <Menu>
      {arraySymbols.map((item, index) => (
        <Menu.Item key={index} onClick={handleMenuClick}>
          <Row >
            <Col xs={8} style={{ paddingLeft: 2 }}>
              <ColourCoin symbol={item} size={22} />
            </Col>
            <Col xs={8} style={{ paddingLeft: 2 }}>
              {item}
            </Col>
          </Row>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <div>
      <Dropdown overlay={menu}>
        {/* <Button style={{ width: 120 }}> */}
        <Row style={style}>
          <Col xs={8} style={{ paddingLeft: 2 }}>
            <ColourCoin symbol={symbol} size={22} />
          </Col>
          <Col xs={8} style={{ paddingLeft: 2 }}>
            {symbol}
          </Col>
          <Col xs={8} style={{ paddingLeft: 2 }}>
            <DownOutlined />
          </Col>
        </Row>
        {/* </Button> */}
      </Dropdown>
    </div>

  )

}
export const TokenSymbol = (props) => {

  useEffect(() => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.symbol])

  const style = {
    width: 100,
    // background: Colour().white,
    // padding:'-20px'
  }
  return (
    <div>
      <Row style={style}>
        <Col xs={8} style={{ paddingLeft: 2 }}>
          <ColourCoin symbol={props.symbol} size={22} />
        </Col>
        <Col xs={8} style={{ paddingLeft: 2 }}>
          {props.symbol}
        </Col>
        <Col xs={8} style={{ paddingLeft: 2 }}>

        </Col>
      </Row>
    </div>

  )

}

export const PoolPaneSide = (props) => {

  const rowStylesPane = {
    marginTop: 20
}

  return (
    <div>
      <Row style={paneStyles}>
        <Col xs={24} style={colStyles}>
          <Row>
            <Col xs={12}>
              <ColourCoin symbol={props.pool.symbol} size={50} style={{ marginTop: 10 }} />
            </Col>
            <Col xs={12}>
              <LabelGroup size={30} element={props.pool.symbol} label={props.pool.name} />
            </Col>
          </Row>

          <Row style={rowStylesPane}>
            <Col xs={12}>
              <LabelGroup size={20} element={formatUSD(convertFromWei(props.pool.depth), props.price)} label={'DEPTH'} />
            </Col>
            <Col xs={12}>
              <LabelGroup size={20} element={formatUSD(props.pool.price, props.price)} label={'PRICE'} />
            </Col>
          </Row>

          <Row style={rowStylesPane}>
            <Col xs={12}>
              <LabelGroup size={20} element={formatUSD(convertFromWei(props.pool.volume), props.price)} label={'VOLUME'} />
            </Col>
            <Col xs={12}>
              <LabelGroup size={20} element={props.pool.txCount} label={'TX COUNT'} />
            </Col>
          </Row>

          <Row style={rowStylesPane}>
            <Col xs={12}>
              <LabelGroup size={20} element={formatUSD(convertFromWei(props.pool.fees), props.price)} label={'FEES'} />
            </Col>
            <Col xs={12}>
              <LabelGroup size={20} element={`${props.pool.apy} %`} label={'APY'} />
            </Col>
          </Row>

        </Col>
      </Row>
    </div>
  )
}

export const PoolPane = (props) => {

  const poolStyles = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: Colour().grey,
    margin: 20,
    padding: 10,
    width: 400
  }

  const colStyles = {
    display: 'flex',
    textAlign: 'center'
  }

  return (
    <div>
      <Col xs={24} sm={24} xl={24} style={poolStyles}>
        <Row>
          <Col xs={24}>
            <ColourCoin symbol={props.symbol} size={40} />
            <Center><Text size={30} margin={"-40px 0px 5px 0px"}>{convertFromWei(props?.balance)}</Text></Center>
            {/* <Center><Label margin={"0px 0px 0px 0px"}>({formatUSD(convertFromWei(props?.balance))})</Label></Center> */}
            <Center><Sublabel margin={"0px 0px 5px 0px"}>DEPTH ({props?.symbol})</Sublabel></Center>

            {!props.hideSubpane &&
              <div>
                <HR />
                <Row style={colStyles}>
                  <Col xs={8}>
                    <Label>{props.data.field1.data}</Label><br />
                    <Sublabel>{props.data.field1.title}</Sublabel>
                  </Col>
                  <Col xs={8}>
                    <Label>{props.data.field2.data}</Label><br />
                    <Sublabel>{props.data.field2.title}</Sublabel>
                  </Col>
                  <Col xs={8}>
                    <Label>{props.data.field3.data}</Label><br />
                    <Sublabel>{props.data.field3.title}</Sublabel>
                  </Col>
                </Row>
              </div>
            }
          </Col>
        </Row>
      </Col>
    </div>
  )
}

export const ColourCoin = (props) => {
  const symbol = props.symbol ? props.symbol : 'XXX'
  const numbers = getIntFromName(symbol)
  const startCol = rainbowStop(numbers[0])
  const stopCol = rainbowStop(numbers[1])
  const coinName = symbol.length > 4 ? symbol.substr(0, 4) : symbol

  const coinStyle = {
    marginTop:5,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    width: props.size,
    height: props.size,
    background: `linear-gradient(45deg, ${startCol}, ${stopCol})`,
  }

  const textStyles = {
    fontWeight: '800',
    // letterSpacing: '1px',
    fontFamily: 'arial',
    textTransform: 'uppercase',
    color: Colour().white,
    fontSize: props.size / 4,
  }

  return (
    <div >
      <Row style={coinStyle}>
        <Col style={{marginTop:5}}>
          <p style={textStyles}>{coinName}</p>
        </Col>
      </Row>
    </div>
  )
}

export const CoinRow = (props) => {

  const rowStyles = {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
  }

  return (
    <div>
      <Row style={rowStyles}>
        <Col xs={4} style={{textAlign:"left"}}>
          <ColourCoin symbol={props.symbol} size={props.size} />
        </Col>
        <Col xs={20}>
          <Row>
            <Col xs={12}>
              <Label size={props.size / 1.8}>{props.symbol}</Label><br />
            </Col>
            <Col xs={12} style={{textAlign:"right"}}>
              <Text size={props.size / 2}>{convertFromWei(props.balance)}</Text><br />
              {/* <Text size={props.size / 3}>({formatUSD(convertFromWei(props.balance))})</Text> */}
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Label size={props.size / 2.2}>{props.name}</Label>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
export const CDPDetails = (props) => {

  const rowStyles = {
    display: 'flex',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',

  }

  return (
    <div>
      <Row style={rowStyles}>
        <Col span={4}>
          <ColourCoin symbol={props.symbol} size={props.size} />
        </Col>
        <Col span={12}>
          <Label size={props.size / 2.2}>{props.name}</Label><br />
        </Col>
        <Col span={6}>
          <Text size={props.size / 2}>{convertFromWei(props.balance)}</Text><br />
          <Text size={props.size / 3}>({formatUSD(convertFromWei(props.balance))})</Text>
        </Col>

      </Row>
    </div>
  )
}

export const CLTButtonRow = (props) => {

  const change110 = () => { props.changeAmount(110) }
  const change125 = () => { props.changeAmount(125) }
  const change150 = () => { props.changeAmount(150) }
  const change200 = () => { props.changeAmount(200) }

  const btnStyle = {
    marginRight: 3.5
  }
  return (
    <>
      <Row style={{ marginBottom: 10 }}>
        <Col xs={24}>
          <Button type="dashed" style={btnStyle} onClick={change110}>110%</Button>
          <Button type="dashed" style={btnStyle} onClick={change125}>125%</Button>
          <Button type="dashed" style={btnStyle} onClick={change150}>150%</Button>
          <Button type="dashed" style={btnStyle} onClick={change200}>200%</Button>
        </Col>
      </Row>
    </>
  )
}
export const CDPPane = (props) => {

  const poolStyles = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: Colour().grey,
    margin: 20,
    padding: 10,
    width: 400
  }

  // const colStyles = {
  //   display: 'flex',
  //   textAlign: 'center'
  // }

  return (
    <div>
      <Col xs={24} sm={24} xl={24} style={poolStyles}>
        <Row>
          <Col xs={24}>
            <Divider><Label size={20}>{props.name}</Label> </Divider>
            <ColourCoin symbol={props.symbol} size={40} />
            <Center><Text size={30} margin={"-40px 0px 5px 0px"}>{convertFromWei(props?.balance)}</Text></Center>
            <Center><Label margin={"0px 0px 0px 0px"}>({formatUSD(convertFromWei(props?.balance))})</Label></Center>
          </Col>
        </Row>
      </Col>
    </div>
  )
}