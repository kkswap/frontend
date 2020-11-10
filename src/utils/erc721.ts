import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import ERC721ABI from '../constants/abi/ERC721.json'

export const getNFTContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (ERC721ABI.abi as unknown) as AbiItem,
    address,
  )
  return contract
}

export const getAllowance = async (
  lpContract: Contract,
  masterChefContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.methods
      .isApprovedForAll(account, masterChefContract.options.address)
      .call()
    if(allowance){
      return '1'
    }
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getBalance = async (
  provider: provider,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const lpContract = getNFTContract(provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return '0'
  }
}

export const tokenIdByOwner = async (
  lpContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const tokenId: string = await lpContract.methods
    .tokenOfOwnerByIndex(
      account,
      0,
    ).call()
    return tokenId
  }catch(e){
    return '0'
  }
}