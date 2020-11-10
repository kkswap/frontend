import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {tokenIdByOwner} from '../utils/erc721'
import { stakeNKSN, stakeNKCN, stakeNKCM, getMasterChefContract } from '../sushi/utils'
import { BigNumber } from '../sushi'
import {
  nksnTokenAddress,
  nkcnTokenAddress,
  nkcmTokenAddress,
} from '../sushi/lib/constants.js'

const useNFTStake = (pid:number, lpContract: Contract) => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleStake = useCallback(
    async () => {
      const tokenId = await tokenIdByOwner(lpContract, account)
      if(lpContract.options.address === nksnTokenAddress){
        const txHash = await stakeNKSN(
          getMasterChefContract(sushi),
          pid,
          new BigNumber(tokenId),
          account,
        )
        console.log("NKSN", txHash)
      }
      else if(lpContract.options.address === nkcnTokenAddress){
        const txHash = await stakeNKCN(
          getMasterChefContract(sushi),
          pid,
          new BigNumber(tokenId),
          account,
        )
        console.log("NKCN", txHash)
      }
      else if(lpContract.options.address === nkcmTokenAddress){
        const txHash = await stakeNKCM(
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

  return { onStake: handleStake }
}

export default useNFTStake
