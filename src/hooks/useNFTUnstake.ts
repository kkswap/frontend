import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { unstakeNKSN, unstakeNKCN, unstakeNKCM,
    getNKSNStakedId, getNKCNStakedId, getNKCMStakedId,
    getMasterChefContract } from '../sushi/utils'

import { BigNumber } from '../sushi'
import {
  nksnTokenAddress,
  nkcnTokenAddress,
  nkcmTokenAddress,
} from '../sushi/lib/constants.js'

const useNFTUnstake = (pid:number, lpContract: Contract) => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleUnstake = useCallback(
    async () => {
      if(lpContract.options.address === nksnTokenAddress){
        const tokenId = await getNKSNStakedId(getMasterChefContract(sushi), pid, account)
        console.log("NKSN tokenId", tokenId)
        const txHash = await unstakeNKSN(
          getMasterChefContract(sushi),
          pid,
          new BigNumber(tokenId),
          account,
        )
        console.log("NKSN", txHash)
      }
      else if(lpContract.options.address === nkcnTokenAddress){
        const tokenId = await getNKCNStakedId(getMasterChefContract(sushi), pid, account)
        console.log("NKCN tokenId", tokenId)
        const txHash = await unstakeNKCN(
          getMasterChefContract(sushi),
          pid,
          new BigNumber(tokenId),
          account,
        )
        console.log("NKCN", txHash)
      }
      else if(lpContract.options.address === nkcmTokenAddress){
        const tokenId = await getNKCMStakedId(getMasterChefContract(sushi), pid, account)
        console.log("NKCM tokenId", tokenId)
        const txHash = await unstakeNKCM(
          getMasterChefContract(sushi),
          pid,
          new BigNumber(tokenId),
          account,
        )
        console.log("NKCM", txHash)
      }
    },
    [account, pid, sushi],
  )

  return { onUnstake: handleUnstake }
}

export default useNFTUnstake
