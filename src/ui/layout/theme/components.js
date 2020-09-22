import styled, { keyframes } from 'styled-components'
import { NavLink } from 'react-router-dom'
import { ReactComponent as DropDown } from '../../../assets/images/dropdown.svg'
import { transparentize, darken } from 'polished'
import { ReactComponent as Close } from '../../../assets/images/x.svg'
import Toggle from 'react-switch'

const white = '#FFFFFF'

// for setting css on <html>
const backgroundColor = '#333639'



export const Button = styled.button.attrs(({ warning, theme }) => ({
    backgroundColor: '#FF8F05'
}))`
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 3rem;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ theme }) => theme.white};
  width: 100%;

  :hover,
  :focus {
    background-color: ${({ backgroundColor })};
  }

  :active {
    background-color: ${({ backgroundColor })};
  }

  :disabled {
    background-color: ${({ theme }) => theme.concreteGray};
    color: ${({ theme }) => theme.silverGray};
    cursor: auto;
  }
`

export const Link = styled.a.attrs({
    target: '_blank',
    rel: 'noopener noreferrer'
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.royalBlue};

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

export const BorderlessInput = styled.input`
  color: ${({ theme }) => theme.textColor};
  font-size: 1rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${({ theme }) => theme.inputBackground};

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.chaliceGray};
  }
`

export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.img`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`
export const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;

  padding: 0.25rem 0.85rem 0.75rem;
`
//HEADER STYLE CODE 

export const HeaderFrame = styled.div`
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      width: 100%;
      z-index: 2;
    `

export const HeaderSpan = styled.span`
      width: 100%;
      display: flex;
      justify-content: space-between;
    `

export const MigrateBanner = styled.div`
      width: 100%;
      padding: 12px 0;
      display: flex;
      justify-content: center;
      background-color: ${({ theme }) => theme.uniswapPink};
      color: ${({ theme }) => theme.inputBackground};
      font-weight: 400;
      text-align: center;
      a {
        color: ${({ theme }) => theme.inputBackground};
        text-decoration: underline;
      }
    `

export const MigrateBannerSmall = styled(MigrateBanner)`
      @media (min-width: 960px) {
        display: none;
      }
    `

export const MigrateBannerLarge = styled(MigrateBanner)`
      @media (max-width: 960px) {
        display: none;
      }
    `

export const HeaderElement = styled.div`
      margin: 1.25rem;
      display: flex;
      min-width: 0;
      align-items: center;
    `

export const Nod = styled.span`
      transform: rotate(0deg);
      transition: transform 150ms ease-out;
      margin-right: 4px;

      :hover {
        transform: rotate(-10deg);
      }
    `

export const TestnetWrapper = styled.div`
      white-space: nowrap;
      width: fit-content;
      margin-left: 10px;
    `

export const VersionLabel = styled.span`
      padding: ${({ isV1 }) => (isV1 ? '0.15rem 0.5rem 0.15rem 0.5rem' : '0.15rem 0.25rem 0.13rem 0.5rem')};
      border-radius: 14px;
      background: ${({ theme, isV1 }) => (isV1 ? theme.uniswapPink : 'none')};
      color: ${({ theme, isV1 }) => (isV1 ? theme.inputBackground : theme.uniswapPink)};
      font-size: 0.825rem;
      font-weight: 400;
    `

export const VersionToggle = styled.a`
      border-radius: 16px;
      border: 1px solid ${({ theme }) => theme.uniswapPink};
      color: ${({ theme }) => theme.uniswapPink};
      display: flex;
      width: fit-content;
      cursor: pointer;
      text-decoration: none;
      :hover {
        text-decoration: none;
      }
    `

//CURRENCY INPUT PANEL STYLE CODE

export const SubCurrencySelect = styled.button`
  ${({ theme }) => theme.flexRowNoWrap}
  padding: 4px 50px 4px 15px;
  margin-right: -40px;
  line-height: 0;
  height: 2rem;
  align-items: center;
  border-radius: 2.5rem;
  outline: none;
  cursor: pointer;
  user-select: none;
  background: ${({ theme }) => theme.zumthorBlue};
  border: 1px solid ${({ theme }) => theme.royalBlue};
  color: ${({ theme }) => theme.royalBlue};
`



export const Input = styled(BorderlessInput)`
  font-size: 1.5rem;
  color: ${({ error, theme }) => error && theme.salmonRed};
  background-color: ${({ theme }) => theme.inputBackground};
  -moz-appearance: textfield;
`

export const StyledBorderlessInput = styled(BorderlessInput)`
  min-height: 2.5rem;
  flex-shrink: 0;
  text-align: left;
  padding-left: 1.6rem;
  background-color: ${({ theme }) => theme.concreteGray};
`

export const CurrencySelect = styled.button`
  align-items: center;
  font-size: 1rem;
  color: ${({ selected, theme }) => (selected ? theme.textColor : theme.royalBlue)};
  height: 2rem;
  border: 1px solid ${({ selected, theme }) => (selected ? theme.mercuryGray : theme.royalBlue)};
  border-radius: 2.5rem;
  background-color: ${({ selected, theme }) => (selected ? theme.concreteGray : theme.zumthorBlue)};
  outline: none;
  cursor: pointer;
  user-select: none;

  :hover {
    border: 1px solid
      ${({ selected, theme }) => (selected ? darken(0.1, theme.mercuryGray) : darken(0.1, theme.royalBlue))};
  }

  :focus {
    border: 1px solid ${({ theme }) => darken(0.1, theme.royalBlue)};
  }

  :active {
    background-color: ${({ theme }) => theme.zumthorBlue};
  }
`

export const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const StyledDropDown = styled(DropDown)`
  margin: 0 0.5rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.textColor : theme.royalBlue)};
  }
`

export const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadowColor)};
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.inputBackground};
  z-index: 1;
`

export const Container = styled.div`
  border-radius: 1.25rem;
  border: 0px solid ${({ error, theme }) => (error ? theme.salmonRed : theme.mercuryGray)};
  background-color: ${({ white })};
  
  }
`

export const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.doveGray};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.doveGray)};
  }
`

export const LabelContainer = styled.div`
  flex: 1 1 auto;
  width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const ErrorSpan = styled.span`
  color: ${({ error, theme }) => error && theme.salmonRed};
  :hover {
    cursor: pointer;
    color: ${({ error, theme }) => error && darken(0.1, theme.salmonRed)};
  }
`

export const TokenModal = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 100%;
`

export const ModalHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 0px 0px 1rem;
  height: 60px;
`

export const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.textColor};
  }
`

export const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

export const SearchContainer = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: flex-start;
  padding: 0.5rem 1.5rem;
  background-color: ${({ theme }) => theme.concreteGray};
`

export const TokenModalInfo = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1rem 1.5rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  user-select: none;
`


export const TokenList = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

export const TokenModalRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  user-select: none;

  #symbol {
    color: ${({ theme }) => theme.doveGrey};
  }

  :hover {
    background-color: ${({ theme }) => theme.tokenRowHover};
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0.8rem 1rem;
    padding-right: 2rem;
  `}
`

export const TokenRowLeft = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items : center;
`

export const TokenSymbolGroup = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  margin-left: 1rem;
`

export const TokenFullName = styled.div`
  color: ${({ theme }) => theme.chaliceGray};
`

export const FadedSpan = styled.span`
  color: ${({ theme }) => theme.royalBlue};
`

export const TokenRowBalance = styled.div`
  font-size: 1rem;
  line-height: 20px;
`

export const TokenRowUsd = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${({ theme }) => theme.chaliceGray};
`

export const TokenRowRight = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: flex-end;
`

export const StyledTokenName = styled.span`
  margin: 0 0.25rem 0 0.25rem;
`

export const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.75rem 0 0.75rem;
  color: ${({ theme }) => theme.chaliceGray};
  opacity: 0.6;
`


//EXCHANGE STYLE PAGE
export const ExchangeRateWrapper = styled.div`
      ${({ theme }) => theme.flexRowNoWrap};
      align-items: center;
      color: ${({ theme }) => theme.doveGray};
      font-size: 0.75rem;
      padding: 0.5rem 1rem;
    `

export const ExchangeRate = styled.span`
      flex: 1 1 auto;
      width: 0;
      color: ${({ theme }) => theme.doveGray};
    `

export const Flex = styled.div`
      display: flex;
      justify-content: center;
      padding: 2rem;

      button {
        max-width: 20rem;
      }
    `

/*  return (
    <>
        <CurrencyInputPanel title={t('input')}/>
            <OversizedPanel>
                <DownArrowBackground>
                    <DownArrow />
            </DownArrowBackground>
        </OversizedPanel>
        <CurrencyInputPanel />
        <OversizedPanel>
            <DownArrowBackground>
                <DownArrow />
            </DownArrowBackground>
        </OversizedPanel>
        <AddressInputPanel />
        <OversizedPanel >
            <ExchangeRateWrapper>         
                <ExchangeRate>{t('exchangeRate')}</ExchangeRate>
            </ExchangeRateWrapper>
        </OversizedPanel>
        <TransactionDetails />
        <Flex>
            <Button>
            </Button>
        </Flex>


    </>
    ) */


//FOOTER STYLE CODE

export const FooterFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const FooterElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
  display: flex;
  align-items: center;
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.uniswapPink};

  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.uniswapPink};
  }

  #title {
    display: inline;
    font-size: 0.825rem;
    margin-right: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.uniswapPink};
    :hover {
      color: ${({ theme }) => darken(0.2, theme.uniswapPink)};
    }
  }
`

export const StyledToggle = styled(Toggle)`
  margin-right: 24px;

  .react-switch-bg[style] {
    background-color: ${({ theme }) => darken(0.05, theme.inputBackground)} !important;
    border: 1px solid ${({ theme }) => theme.concreteGray} !important;
  }

  .react-switch-handle[style] {
    background-color: ${({ theme }) => theme.inputBackground};
    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.93, theme.shadowColor)};
    border: 1px solid ${({ theme }) => theme.mercuryGray};
    border-color: ${({ theme }) => theme.mercuryGray} !important;
    top: 2px !important;
  }
`

export const EmojiToggle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: Arial sans-serif;
`


//NAV TABS STYLE CLOSE

export const BetaMessage = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  cursor: pointer;
  flex: 1 0 auto;
  align-items: center;
  position: relative;
  padding: 0.5rem 1rem;
  padding-right: 2rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => transparentize(0.6, theme.wisteriaPurple)};
  background-color: ${({ theme }) => transparentize(0.9, theme.wisteriaPurple)};
  border-radius: 1rem;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme.wisteriaPurple};

  &:after {
    content: '✕';
    top: 0.5rem;
    right: 1rem;
    position: absolute;
    color: ${({ theme }) => theme.wisteriaPurple};
  }
`

export const DaiMessage = styled(BetaMessage)`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  word-wrap: wrap;
  overflow: visible;
  white-space: normal;
  padding: 1rem 1rem;
  padding-right: 2rem;
  line-height: 1.2rem;
  cursor: default;
  color: ${({ theme }) => theme.textColor};
  div {
    width: 100%;
  }
  &:after {
    content: '';
  }
`

export const WarningHeader = styled.div`
  margin-bottom: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.uniswapPink};
`

export const WarningFooter = styled.div`
  margin-top: 10px;
  font-size: 10px;
  text-decoration: italic;
  color: ${({ theme }) => theme.greyText};
`

export const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.concreteGray};
  border-radius: 3rem;
  /* border: 1px solid ${({ theme }) => theme.mercuryGray}; */
  margin-bottom: 1rem;
`

export const activeClassName = 'ACTIVE'

export const StyledNavLink = styled(NavLink).attrs({
    activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  border: 1px solid ${({ theme }) => transparentize(1, theme.mercuryGray)};
  flex: 1 0 auto;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.doveGray};
  font-size: 1rem;
  box-sizing: border-box;

  &.${activeClassName} {
    background-color: ${({ theme }) => theme.inputBackground};
    border-radius: 3rem;
    border: 1px solid ${({ theme }) => theme.mercuryGray};
    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadowColor)};
    box-sizing: border-box;
    font-weight: 500;
    color: ${({ theme }) => theme.royalBlue};
    :hover {
      /* border: 1px solid ${({ theme }) => darken(0.1, theme.mercuryGray)}; */
      background-color: ${({ theme }) => darken(0.01, theme.inputBackground)};
    }
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.royalBlue)};
  }
`


//WALLETMODAL STYLE CLOSE 

//export const CloseIcon = styled.div`
//  position: absolute;
//  right: 1rem;
//  top: 14px;
//  &:hover {
//    cursor: pointer;
//    opacity: 0.6;
//  }
//`

//export const CloseColor = styled(Close)`
//  path {
//    stroke: ${({ theme }) => theme.chaliceGray};
//  }
//`

export const Wrapper = styled.div`
      ${({ theme }) => theme.flexColumnNoWrap}
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: ${({ theme }) => theme.backgroundColor};
    `

export const HeaderRow = styled.div`
      ${({ theme }) => theme.flexRowNoWrap};
      padding: 1.5rem 1.5rem;
      font-weight: 500;
      color: ${props => (props.color === 'blue' ? ({ theme }) => theme.royalBlue : 'inherit')};
      ${({ theme }) => theme.mediaWidth.upToMedium`
        padding: 1rem;
      `};
    `

export const ContentWrapper = styled.div`
      background-color: ${({ theme }) => theme.backgroundColor};
      padding: 2rem;
      ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
    `

export const UpperSection = styled.div`
      position: relative;
      background-color: ${({ theme }) => theme.concreteGray};

      h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 400;
      }

      h5:last-child {
        margin-bottom: 0px;
      }

      h4 {
        margin-top: 0;
        font-weight: 500;
      }
    `

export const Blurb = styled.div`
      ${({ theme }) => theme.flexRowNoWrap}
      align-items: center;
      justify-content: center;
      margin-top: 2rem;
      ${({ theme }) => theme.mediaWidth.upToMedium`
        margin: 1rem;
        font-size: 12px;
      `};
    `

export const OptionGrid = styled.div`
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      ${({ theme }) => theme.mediaWidth.upToMedium`
        grid-template-columns: 1fr;
        grid-gap: 10px;
      `};
    `

export const HoverText = styled.div`
      :hover {
        cursor: pointer;
      }
    `


//WARNING CARD STYLE CLOSE

//  export const Flex = styled.div`
//display: flex;
//justify-content: center;
//padding: 2rem;

//button {
//  max-width: 20rem;
//}
//`

//    export const Wrapper = styled.div`
//  background: rgba(243, 190, 30, 0.1);
//  position: relative;
//  padding: 1rem;
//  border: 0.5px solid #f3be1e;
//  border-radius: 10px;
//  margin-bottom: 20px;
//  display: grid;
//  grid-template-rows: 1fr 1fr 1fr;
//  grid-row-gap: 10px;
//`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-items: flex-start;
  & > * {
    margin-right: 6px;
  }
`


export const QuestionWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  margin-left: 0.4rem;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;

  :hover,
  :focus {
    opacity: 0.7;
  }
`

export const HelpCircleStyled = styled.img`
  height: 18px;
  width: 18px;
`

export const fadeIn = keyframes`
  from {
    opacity : 0;
  }

  to {
    opacity : 1;
  }
`

export const Popup = styled(Flex)`
  position: absolute;
  width: 228px;
  right: 110px;
  top: 4px;
  z-index: 10;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 1rem;
  line-height: 150%;
  background: ${({ theme }) => theme.backgroundColor};
  border: 1px solid ${({ theme }) => theme.mercuryGray};
  border-radius: 8px;
  animation: ${fadeIn} 0.15s linear;
  color: ${({ theme }) => theme.textColor};
  font-style: italic;

  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.04);

  ${({ theme }) => theme.mediaWidth.upToSmall`
    left: 2px;
    top: 50px;
  `}
`


//ADDRESS INPUT PANEL STYLE CLOSE

//    export const InputPanel = styled.div`
//  ${({ theme }) => theme.flexColumnNoWrap}
//  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadowColor)};
//  position: relative;
//  border-radius: 1.25rem;
//  background-color: ${({ theme }) => theme.inputBackground};
//  z-index: 1;
//`

export const ContainerRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid ${({ error, theme }) => (error ? theme.salmonRed : theme.mercuryGray)};

  background-color: ${({ theme }) => theme.inputBackground};
`

export const InputContainer = styled.div`
  flex: 1;
`

export const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100vh;
`

export const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`
export const FooterWrapper = styled.div`
  width: 100%;
  min-height: 55px;
  align-self: flex-end;
`

export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  overflow: auto;
`

export const Body = styled.div`
  max-width: 35rem;
  width: 90%;
  /* margin: 0 1.25rem 1.25rem 1.25rem; */
`



