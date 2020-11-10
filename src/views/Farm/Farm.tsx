import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import useSushi from '../../hooks/useSushi'
import { getMasterChefContract } from '../../sushi/utils'
import { getContract } from '../../utils/erc20'
import { getNFTContract} from '../../utils/erc721'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import NFTStake from './components/NFTStake'
import {
  nksnTokenAddress,
  nkcnTokenAddress,
  nkcmTokenAddress,
} from '../../sushi/lib/constants.js'

const Farm: React.FC = () => {
  const { farmId } = useParams()
  const {
    pid,
    lpToken,
    lpTokenAddress,
    tokenAddress,
    earnToken,
    name,
    icon,
  } = useFarm(farmId) || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    earnToken: '',
    name: '',
    icon: '',
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sushi = useSushi()
  const { ethereum } = useWallet()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  const nksnContract = useMemo(() =>{
    return getNFTContract(ethereum as provider, nksnTokenAddress)
  }, [ethereum, nksnTokenAddress])

  const nkcnContract = useMemo(() =>{
    return getNFTContract(ethereum as provider, nkcnTokenAddress)
  }, [ethereum, nkcnTokenAddress])

  const nkcmContract = useMemo(() =>{
    return getNFTContract(ethereum as provider, nkcmTokenAddress)
  }, [ethereum, nkcmTokenAddress])

  const { onRedeem } = useRedeem(getMasterChefContract(sushi))

  const lpTokenName = useMemo(() => {
    return lpToken.toUpperCase()
  }, [lpToken])

  const earnTokenName = useMemo(() => {
    return earnToken.toUpperCase()
  }, [earnToken])

  //{<img src={require("../../"+icon)} style={{ height: 96 }} />}

  return (
    <>
      <PageHeader
        icon={<img src={require("../../"+icon)} style={{ height: 120 }} />}
        subtitle={`Deposit ${lpTokenName}  Tokens and earn ${earnTokenName}`}
        title={name}
      />
      <StyledFarm>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <Harvest pid={pid} />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Stake
              lpContract={lpContract}
              pid={pid}
              tokenName={lpToken.toUpperCase()}
            />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer />
        <StyledCardsWrapper>
        <StyledCardWrapper>
          <NFTStake
              lpContract={nksnContract}
              pid={pid}
              tokenName={'NKSN'}
              tokenId={0}
          />
        </StyledCardWrapper>
        <Spacer />
        <StyledCardWrapper>
          <NFTStake
              lpContract={nkcnContract}
              pid={pid}
              tokenName={'NKCN'}
              tokenId={0}
          />
        </StyledCardWrapper>
        <Spacer />
        <StyledCardWrapper>
          <NFTStake
              lpContract={nkcmContract}
              pid={pid}
              tokenName={'NKCM'}
              tokenId={0}
          />
        </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        <StyledInfo>
          ⭐️ Every time you stake and unstake LP tokens, the contract will
          automagically harvest wKSA rewards for you!
        </StyledInfo>
        <Spacer size="lg" />
      </StyledFarm>
    </>
  )
}

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default Farm
