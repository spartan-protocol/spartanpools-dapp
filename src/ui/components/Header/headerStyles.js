import React from 'react'
import styled from 'styled-components'
import { Link } from '../../layout/theme'
import { darken } from 'polished'
import { Colour } from '../elements';
import '../../../App.css'


export const MigrateBanner = styled.div`
  width: 100%;
  padding: 12px 20;
  max-height: 60px;
  display: flex;
  justify-content: center;
  background-color: var(--spartanGrey);
  color: ${ Colour().white};
  font-weight: 400;
  text-align: center;
  a {
    color: ${({ theme }) => theme.inputBackground};
    text-decoration: underline;
  }
`


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

export const MigrateBannerSmall = styled(MigrateBanner)`
  @media (min-width: 960px) {
    display: none;
  }
`

export const MigrateBannerLarge = styled(MigrateBanner)`
  @media (max-width: 960px) {
    display: none;
    colour: '#FF8F05';
  }
`

export const HeaderElement = styled.div`
  margin: 2rem;
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

export const Title = styled.div`
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  #link {
    text-decoration-color: ${({ theme }) => theme.UniswapPink};
  }

  #title {
    display: inline;
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.wisteriaPurple};
    :hover {
      color: ${({ theme }) => darken(0.1, theme.wisteriaPurple)};
    }
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