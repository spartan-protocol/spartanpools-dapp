import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from 'styled-components'
import { Layout } from 'antd';
import './App.css';
//import 'antd/dist/antd.css'
import { Colour } from './ui/components/elements'
import Headbar from './ui/components/Header'
import SimpleSwap from './ui/pages/SimpleSwap'
import Footer from './ui/layout/Footer'
import { ContextProvider } from './context'
import { FooterWrapper } from './ui/layout/theme';
import Sidebar from './ui/layout/Sidebar';


const { Content } = Layout;

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100vh;
`

const Body = styled.div`
  max-width: 35rem;
  width: 90%;
   margin: 0 1.25rem 1.25rem 1.25rem; 
`


const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

/*This is the page background color*/
const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  overflow: auto;
  background-color: var(--sandBland);
`

const contentStyles = {
    background: Colour().black,
    color: '#000',
    padding: 150,
}

const App = () => {
    return (
        <Router>
            <div>
                <ContextProvider>
                    <AppWrapper>
                        <HeaderWrapper>
                            <Headbar />
                        </HeaderWrapper>
                        <BodyWrapper>
                            <Body>
                                <Switch>
                                    <Route path="/" exact component={SimpleSwap} />
                                    <Route path="/swap" exact component={SimpleSwap} />
                                </Switch>
                            </Body>
                        </BodyWrapper>
                        <footer />
                    </AppWrapper>
                </ContextProvider>
            </div>
        </Router>
    );
}

export default App;



/*
<div>
    <div class='page-background'>
        <Router>
            <ContextProvider>
                <Headbar />
                <div class='column.middle'>
                    <div class='border'>
                        <div class='box'>
                            <Switch>
                                <Route path="/" exact component={SimpleSwap} />
                                <Route path="/swap" exact component={SimpleSwap} />
                            </Switch>
                        </div>

                    </div>
                </div>

            </ContextProvider>
        </Router >
    </div>
    <div class='footer'>
        <Footer />
    </div>
</div>

    );
}

*/