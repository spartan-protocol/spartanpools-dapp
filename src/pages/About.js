import React from 'react'

import {
    Row,
    Col,
} from "reactstrap";

import {
    H1, Subtitle
} from '../components/elements';

import {
    POOLS_ADDR,
} from '../client/web3'

const About = (props) => {

    return (
        <div>
            <Row>
                <Col xs={24}>
                    <H1>Sparta Pools - V2</H1><br />
                    <Subtitle>Sparta Pools is an experimental Liquidity Pool System that uses dynamic slip-based fees to maximise revenue for liquidity providers. </Subtitle><br />
                    <Subtitle> </Subtitle><br />
                    <a href="https://github.com/spartan-protocol/resources/blob/master/whitepaper.pdf"
                    target="blank">
                    You can read more about it here.
                    </a>
                    <br /><br />
                    <a href={POOLS_ADDR}
                    target="blank">
                    Current Contract
                    </a>
                </Col>

            </Row>

        </div>
    )
}

export default About
