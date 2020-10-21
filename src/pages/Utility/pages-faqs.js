import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Media, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from 'classnames';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class PagesFaqs extends Component {
    constructor() {
        super();
        this.state = {
            activeTab: '1',
        }
        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="Utility" breadcrumbItem="FAQs" />

                        <div className="checkout-tabs">
                            <Row>
                                <Col lg="2">
                                    <Nav className="flex-column" pills>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '1' })}
                                                onClick={() => { this.toggleTab('1'); }}
                                            >
                                                <i className="bx bx-question-mark d-block check-nav-icon mt-4 mb-2"></i>
                                                <p className="font-weight-bold mb-4">General Questions</p>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '2' })}
                                                onClick={() => { this.toggleTab('2'); }}
                                            >
                                                <i className="bx bx-swim d-block check-nav-icon mt-4 mb-2"></i>
                                                <p className="font-weight-bold mb-4">Liquidity Pools</p>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '3' })}
                                                onClick={() => { this.toggleTab('3'); }}
                                            >
                                                <i className="bx bx-money d-block check-nav-icon mt-4 mb-2"></i>
                                                <p className="font-weight-bold mb-4">Staking of LP Tokens</p>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '4' })}
                                                onClick={() => { this.toggleTab('4'); }}
                                            >
                                                <i className="bx bx-support d-block check-nav-icon mt-4 mb-2"></i>
                                                <p className="font-weight-bold mb-4">Support</p>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>
                                <Col lg="10">
                                    <Card>
                                        <CardBody>
                                            <TabContent activeTab={this.state.activeTab}>
                                                <TabPane tabId="1">
                                                    <CardTitle className="mb-5">General Questions</CardTitle>
                                                    <Media className="faq-box mb-4">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">What is Spartan Protocol??</h5>
                                                            <p className="text-muted">The Spartan Protocol is a wholesome and complete protocol that allows the safe growth of synthetic assets, lending markets and for all assets to be liquid and productive.
                                                                A small amount of governance is necessary to manage the upgrading of contracts and the tweaking of some of the protocol’s parameters.<br/><br/>
                                                                The governance process is at-risk as such that there is a direct link between healthy and effective governance and the value of exposed collateral. The Spartan Protocol borrows ideas for UniSwap, THORChain, Synthetix, MakerDAO and Vader/Vether Protocol, but exists on Binance Smart Chain as its own separate protocol.
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box mb-4">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">Who are the founders?</h5>
                                                            <p className="text-muted">The project is galvanized by communities of former Binance Chain projects. The project begins decentralised from day 0, with no official team and no treasury.
                                                        </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box mb-4">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">Is the team anonymous?</h5>
                                                            <p className="text-muted">Yes, the Spartan Protocol is a community driven initiative with a wide and diverse source of contributors. It draws inspiration from THORchain and other projects that elected to go anonymous in line with the world’s most known token, Bitcoin.  This is done to protect the project and its users to assist in ensuring it can be more decentralised from its outset. The focus should be on the project, code and the community that drives it, which are transparent and verifiable.<br/><br/>
                                                                Don’t trust, verify! <a target="_blank" href="https://github.com/spartan-protocol" rel="noopener noreferrer">Github</a></p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box mb-4">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">No airdrop — No founder/team tokens — No pre-sale?</h5>
                                                            <p className="text-muted">Zero, zip, none, nada — like the 300 Spartans that held Hells Gate, the team believe in the true intent of DeFi to provide open solutions for all on an EQUAL playing field. The only way for anyone to have access to the initial minting SPARTA tokens is by burning selected BEP20 tokens. This applies to everyone, there are no advantages given here. The Spartans believe the token will accrue value through genuine use and not through gimmicks.<br/><br/>
                                                                The most important component of SP is that the team doesn’t have FREE skin in the game — if they want Sparta, they burn as well. There are no presale or private sale allocations waiting to be dumped.
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">I see this is a community project, so how can I contribute or influence the direction of Spartan Protocol?
                                                            </h5>
                                                            <p className="text-muted">Right now you can contribute by being a part of the community channels and asking good questions. What is said in these channels directly influences what happens leading up to launch as each of you are a part of the decentralised team.<br/><br/>
                                                                Please see the Report Bug/Suggest Feature tab for how to raise GitHub issue for the developers to address directly whilst working on the code. This will help keep a clean and clear set of priorities for the devs to work on. If you know how already, head over to Spartan Protocol Github and submit your issues now, and thankyou!  If you are not, contribute your words or put your hand up for other jobs in the community channels at the bottom of this page. This FAQ was curated by the community, many hands make light work!
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">How to obtain SPARTA tokens?
                                                            </h5>
                                                            <p className="text-muted">Spartan Protocol starts decentralised from day one. To acquire SPARTA you will need to either send your tokens through a smart contract on the Spartan Protocol DApp, or purchase a previously minted SPARTA token on an exchange such as <a target="_blank" href="http://www.binance.com/" rel="noopener noreferrer">Binance</a>.  The tokens sent through the Smart Contract will be ‘burnt’ and will no longer be usable by anyone. The smart contract will then send your freshly minted SPARTA of equivalent value to your BSC address once the old tokens have been confirmed burned.<br/><br/>
                                                                There is minimal wait compared to smart contracts on Ethereum, most processes take only 1–5 seconds
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">So do I need to buy coins to get tokens?
                                                            </h5>
                                                            <p className="text-muted">Not necessarily; to obtain SPARTA tokens you will need to have BEP20 tokens from the chosen projects to burn in exchange for SPARTA, or have an existing coin or token such as BNB for purchase on CEX or DEX.<br/><br/>
                                                                There might be some you already own, some you already hold, some you want to sell but can’t get the right price, or some that you decide to acquire deliberately for the purpose of getting Sparta.
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">Why is burning the collateral necessary, can't we donate it somewhere or use the funds as a treasury?
                                                            </h5>
                                                            <p className="text-muted">By burning your tokens to receive SPARTA, it shows an individual’s commitment to the project, every token has an inherent value associated with it set by the market.  This in effect transfers their value over to the SPARTA token. If the Protocol was to hold or dispense the tokens received that value would be diluted.<br/><br/>
                                                                We are not interested in anything resembling an ICO where valuations are manipulated. Besides, the community is confident they can provide the functionality discussed in the Whitepaper without a treasury.
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">I am interested but not keen to risk a lot of money! Is there a minimum amount i can burn?
                                                            </h5>
                                                            <p className="text-muted">There is no minimum quantity! Binance Smart Chain fees are also very low allowing for smaller token holders to participate.<br/><br/>
                                                                However; the current MetaMask implementation REQUIRES AT LEAST 0.51 BNB in your wallet for the DApp to work properly! If MetaMask comes up with a crazy fees-price, then this is the issue, make sure you get more BNB in your wallet!
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">Do I need BNB to use Spartan Protocol?
                                                            </h5>
                                                            <p className="text-muted">Yes, please make sure you have at least 0.51 BNB in your wallet to interact with MetaMask properly, if you are wishing to Burn for SPARTA.  You will use less than 0.05 BNB to pay for transactions, other operations and staking. BNB performs the same function as ETH for the Ethereum mainnet (aka 'gas').  However, one of the biggest differences is that Binance Smart Chain's fees are extremely low (and fast) compared to Ethereum! We are talking single digit cents, none of these $80-dollar Ethereum transactions when networks are congested!<br/><br/>
                                                                Liquidity providers have the choice to stake their tokens paired with SPARTA in an asymmetric fashion, however we highly recommend a clear understanding of how AMM protocols function in regards to asymmetric liquidity provision, as not all AMM protocols function the same way.
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                </TabPane>
                                                <TabPane tabId="4">
                                                    <CardTitle className="mb-5">Support</CardTitle>
                                                    <Media className="faq-box mb-4">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">Please help!</h5>
                                                            <p className="text-muted">SP is a community project, feel free to reach out to the community for support at <a target="_blank" href="https://t.me/SpartanProtocolOrg" rel="noopener noreferrer">Official Telegram Community Channel</a></p>
                                                        </Media>
                                                    </Media>
                                                </TabPane>
                                                <TabPane tabId="2">
                                                    <CardTitle className="mb-5">Liquidity Pools</CardTitle>
                                                    <Media className="faq-box mb-4">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">Walk me through this.. Liquidity Pools? Swaps? Fees? AMM?
                                                            </h5>
                                                            <p className="text-muted">Spartan Protocol is, as per the <a target="_blank" href="https://github.com/spartan-protocol/resources/blob/master/whitepaper.pdf" rel="noopener noreferrer">Spartan Protocol Whitepaper</a>, a protocol for incentivised liquidity and synthetic assets on Binance Smart Chain. Step 1 of this protocol is the provision of Liquidity Pools, allowing a user to stake a coin or token (referred to as an Asset) with SPARTA.<br/><br/>
                                                                The benefits of staking your SPARTA and Asset in the Liquidity Pools include:<br/><br/>
                                                                - Liquidity for the purpose of Asset Swaps<br/>
                                                                - Earning of slippage fees based on the AMM model<br/>
                                                                - Eligibility for daily SPARTA rewards<br/>
                                                                - Ability to engage in the Spartan Protocol DAO (coming soon)<br/>
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                </TabPane>
                                                <TabPane tabId="3">
                                                    <CardTitle className="mb-5">Staking of LP Tokens</CardTitle>
                                                    <Media className="faq-box mb-4">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">What is LP Staking?</h5>
                                                            <p className="text-muted">Briefly - it's the ability for a participant in the Liquidity Pools to effectively lock their liquidity into the Spartan Protocol, and be rewarded for their contribution to the pool depth.
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">SP is LIVE?</h5>
                                                            <p className="text-muted">It sure is! Spartan Protocol initially released the Earn dApp with 1000 SPARTA sitting in the emissions pool for testing purposes. This has now been replaced with emissions of approximately 20,000 SPARTA per day as of 21 October 2020 *.<br/><br/>
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">Walk me through how the Yield Emissions work.</h5>
                                                            <p className="text-muted">Daily Yield during the initial stages of Spartan Protocol was estimated at ~30% APY, however a decision has been made to fix this return to approximately <b>125% APY</b> based on current LP levels.<br/>
                                                                - This can be calculated (effective 21 October, at least), based on $400k LP Total / (365 x (20,000 x $0.066)). This APY is based on an assumption that 100% of Liquidity Providers are staking their tokens.<br/>
                                                                - At present, approx. 65% of LP tokens are staked, resulting in $260K / (365 x (20,000 x $0.066)) = <b>APY of approximately 185%</b>.<br/><br/>
                                                                * Please note that as per the initial launch of Earn, the emissions pool is filling with SPARTA at a rate of 20,000 tokens per day, but is not yet emitting a full 20,000 per day. It's designed to scale up the emissions from Launch to a point after 30 days where the pool is full, and maintain parity of 30 days' SPARTA in/out from this point onwards.<br/><br/>
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">... And then i work out my ratio of the staked SPARTA to the SPARTA in the LP, and i get X%? Can't you make it easier for me to calculate?
                                                            </h5>
                                                            <p className="text-muted">We're in agreement! We will get some fancy UX built in so that Spartans can fully understand their positions in the Spartan Protocol ecosystem.<br/><br/>
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                    <Media className="faq-box">
                                                        <div className="faq-icon mr-3">
                                                            <i className="bx bx-help-circle font-size-20 text-success"></i>
                                                        </div>
                                                        <Media body>
                                                            <h5 className="font-size-15">I do have some further questions...
                                                            </h5>
                                                            <p className="text-muted">Jump onto Telegram and we will be happy to help you out!<br/><br/>
                                                            </p>
                                                        </Media>
                                                    </Media>
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

// new FAQ item shortcut
//<Media className="faq-box">
//<div className="faq-icon mr-3">
//<i className="bx bx-help-circle font-size-20 text-success"></i>
//</div>
//<Media body>
//<h5 className="font-size-15">Question?
//</h5>
//<p className="text-muted">Answer!
//</p>
//</Media>
//</Media>
export default PagesFaqs;