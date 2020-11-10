import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import IconButton from '../../../components/IconButton'
import { AddIcon,RemoveIcon } from '../../../components/icons'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useNFTAllowance from '../../../hooks/useNFTAllowance'
import useNFTApprove from '../../../hooks/useNFTApprove'
import useModal from '../../../hooks/useModal'
import useNFTStake from '../../../hooks/useNFTStake'
import useStakedNKSNBalance from '../../../hooks/useStakedNKSNBalance'
import useStakedNKCNBalance from '../../../hooks/useStakedNKCNBalance'
import useStakedNKCMBalance from '../../../hooks/useStakedNKCMBalance'
import useNFTTokenBalance from '../../../hooks/useTokenBalance'
import useNFTUnstake from '../../../hooks/useNFTUnstake'
import { getBalanceNumber } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import Input from '../../../components/Input'

interface NFTStakeProps {
  lpContract: Contract
  pid: number
  tokenName: string
  tokenId: number
}

const NFTStake: React.FC<NFTStakeProps> = ({ lpContract, pid, tokenName }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)

  const allowance = useNFTAllowance(lpContract)
  const { onApprove } = useNFTApprove(lpContract)

  const tokenBalance = useNFTTokenBalance(lpContract.options.address)
  const stakedNKSNBalance = useStakedNKSNBalance(pid)
  const stakedNKCNBalance = useStakedNKCNBalance(pid)
  const stakedNKCMBalance = useStakedNKCMBalance(pid)
  var stakedBalance
  if(tokenName === "NKSN"){
    stakedBalance = stakedNKSNBalance
  }
  else if(tokenName === "NKCN"){
    stakedBalance = stakedNKCNBalance
  }
  else if(tokenName === "NKCM"){
    stakedBalance = stakedNKCMBalance
  }

  const { onStake } = useNFTStake(pid, lpContract)
  const { onUnstake } = useNFTUnstake(pid, lpContract)

  const onChange = ()=>{

  }

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={new BigNumber(0)}
      onConfirm={onUnstake}
      tokenName={tokenName}
    />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>{<img src={require("../../../assets/img/"+tokenName+".png")} style={{ height: 70 }} />}</CardIcon>
            <Label text={tokenName} />
            <StyledActionSpacer />
            <Label text={`Staked: `+ stakedBalance.toNumber()} />
            <Label text={`To stake: `+tokenBalance} />
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={`Approve ${tokenName}`}
              />
            ) : (
                <>
                <IconButton disabled={tokenBalance.toNumber()===0} onClick={onStake}>
                  <AddIcon />
                </IconButton>
                <StyledActionSpacer />
                <IconButton disabled={stakedBalance.toNumber()===0} onClick={onUnstake}>
                  <RemoveIcon />
                </IconButton>
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default NFTStake
