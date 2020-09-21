import React from 'react'
import { createGlobalStyle, css } from 'styled-components'


export * from './components'

const white = '#FFFFFF'
const black = '#000000' 


const theme = () => ({
    white,
    black,
    textColor: white,
    greyText: white,

    // for setting css on <html>
    backgroundColor: '#333639',

    modalBackground: 'rgba(0,0,0,0.6)',
    inputBackground: '#202124',
    placeholderGray: '#5F5F5F',
    shadowColor: '#000',

    // grays
    concreteGray: '#292C2F',
    mercuryGray: '#333333',
    silverGray: '#737373',
    chaliceGray: '#7B7B7B',
    doveGray: '#C4C4C4',
    mineshaftGray: '#E1E1E1',
    activeGray: '#292C2F',
    buttonOutlineGrey: '#FAFAFA',
    tokenRowHover: '#404040',

    //blacks
    charcoalBlack: '#F2F2F2',
    // blues
    zumthorBlue: '#212529',
    malibuBlue: '#E67AEF',
    royalBlue: '#DC6BE5',
    loadingBlue: '#e4f0ff',

    // purples
    wisteriaPurple: '#DC6BE5',
    // reds
    salmonRed: '#FF6871',
    // orange
    pizazzOrange: '#FF8F05',
    // yellows
    warningYellow: '#FFE270',
    // pink
    uniswapPink: '#DC6BE5',
    //green
    connectedGreen: '#27AE60',

    //branded
    metaMaskOrange: '#E8831D',

    //specific
    textHover: theme.uniswapPink,

    // connect button when loggedout
    buttonFaded: '#DC6BE5',

    // css snippets
    flexColumnNoWrap: css`
    display: flex;
    flex-flow: column nowrap;
  `,
    flexRowNoWrap: css`
    display: flex;
    flex-flow: row nowrap;
  `
})

export const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: 'Spartan';
    src: local('Spartan'), url(../../../assets/font/Spartan-Regular.ttf) format('truetype');
} 

  @import url('https://rsms.me/inter/inter.css');
  html { font-family: Spartan, sans-serif; }
  @supports (font-variation-settings: normal) {
    html { font-family: Spartan, sans-serif; }
  }

 

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;    
  }

  body > div {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}

  html {
    font-size: 12px;
    font-variant: none;
    color: ${({ white })};
    background-color: '#333639';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
`
