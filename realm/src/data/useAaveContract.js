import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Contract, Provider } from 'ethers-multicall'
import abi from './pockets/aaveContractAbi.json'

let provider = null
let ethcallProvider = null
const contractAddress = '0x357D51124f59836DeD84c8a1730D72B749d8BC23'

let contract = null

const initContract = function () {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
  }
  contract = new Contract(
    contractAddress,
    abi
  )
  ethcallProvider = new Provider(provider, 137) // provide chainId so we don't need to call init
}

const aave = {
  /* gotchi objects should have id, escrow and collateral */
  getGotchiRewardsBalances: async function (gotchis) {
    if (!contract) {
      initContract()
    }
    // console.log('Get aave rewards balances', gotchis)
    const contractCalls = gotchis.map(gotchi => contract.getRewardsBalance([gotchi.collateral], gotchi.escrow))

    const results = await ethcallProvider.all(contractCalls)
    // console.log({ results })
    // ethers returns the result as its own BigNumber - convert it
    const resultsByGotchiId = Object.fromEntries(
      results.map((result, index) => [gotchis[index]?.id, new BigNumber(result.toString()).div(10e17)])
    )
    // console.log('getRewardsBalances: Results', gotchis, resultsByGotchiId)
    return resultsByGotchiId
  }
}

export default function useAave () {
  return aave
}
