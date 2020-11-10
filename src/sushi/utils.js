import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getMasterChefAddress = (sushi) => {
  return sushi && sushi.masterChefAddress
}
export const getSushiAddress = (sushi) => {
  return sushi && sushi.sushiAddress
}
export const getWethContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.weth
}

export const getMasterChefContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}
export const getSushiContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}

export const getFarms = (sushi) => {
  return sushi
    ? sushi.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          lpAddress,
          lpContract,
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'wKSA',
          earnTokenAddress: sushi.contracts.sushi.options.address,
          icon,
        }),
      )
    : []
}

export const getPoolWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterChefContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
  return masterChefContract.methods.pendingWKSA(pid, account).call()
}

export const getTotalLPWethValue = async (
  masterChefContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
) => {
  console.log("toekn address", tokenContract)
  // Get balance of the token address
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  const tokenDecimals = await tokenContract.methods.decimals().call()
  // Get the share of lpContract that masterChefContract owns
  const balance = await lpContract.methods
    .balanceOf(masterChefContract.options.address)
    .call()
  // Convert that into the portion of total lpContract = p1
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1
  const lpContractWeth = await wethContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  const lpWethWorth = new BigNumber(lpContractWeth)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals))

  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(masterChefContract, pid),
  }
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const approveNFT = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .setApprovalForAll(masterChefContract.options.address, true)
    .send({ from: account })
}

export const getSushiSupply = async (sushi) => {
  return new BigNumber(await sushi.contracts.sushi.methods.totalSupply().call())
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      0,
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const stakeNKSN = async (masterChefContract, pid, tokenId, account) => {
  return masterChefContract.methods
    .stakeNKSN(
      tokenId,
      pid,
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const stakeNKCN = async (masterChefContract, pid, tokenId, account) => {
  return masterChefContract.methods
    .stakeNKCN(
      tokenId,
      pid,
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const stakeNKCM = async (masterChefContract, pid, tokenId, account) => {
  return masterChefContract.methods
    .stakeNKCM(
      tokenId,
      pid,
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstakeNKSN = async (masterChefContract, pid, tokenId, account) => {
  return masterChefContract.methods
    .withdrawNKSN(
      tokenId,
      pid,
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstakeNKCN = async (masterChefContract, pid, tokenId, account) => {
  return masterChefContract.methods
    .withdrawNKCN(
      tokenId,
      pid,
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstakeNKCM = async (masterChefContract, pid, tokenId, account) => {
  return masterChefContract.methods
    .withdrawNKCM(
      tokenId,
      pid,
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0', 0)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getWeight = async (masterChefContract, pid, account) => {
  try {
    const { weight } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(weight)
  } catch {
    return new BigNumber(0)
  }
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const getNKSNStaked = async (masterChefContract, pid, account) => {
  try {
    const { nksnLength } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(nksnLength)
  } catch {
    return new BigNumber(0)
  }
}

export const getNKSNStakedId = async (masterChefContract, pid, account) => {
  try {
    const nksnId = await masterChefContract.methods
      .nksnList(pid, account, '0')
      .call()
    return nksnId
  } catch {
    return '0'
  }
}

export const getNKCNStaked = async (masterChefContract, pid, account) => {
  try {
    const { nkcnLength } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(nkcnLength)
  } catch {
    return new BigNumber(0)
  }
}

export const getNKCNStakedId = async (masterChefContract, pid, account) => {
  try {
    const nkcnId = await masterChefContract.methods
      .nkcnList(pid, account, '0')
      .call()
    return nkcnId
  } catch {
    return '0'
  }
}

export const getNKCMStaked = async (masterChefContract, pid, account) => {
  try {
    const { nkcmLength } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(nkcmLength)
  } catch {
    return new BigNumber(0)
  }
}

export const getNKCMStakedId = async (masterChefContract, pid, account) => {
  try {
    const nkcmId = await masterChefContract.methods
      .nkcmList(pid, account, '0')
      .call()
    return nkcmId
  } catch {
    return '0'
  }
}

export const redeem = async (masterChefContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}
