import 'core-js/stable'
import 'regenerator-runtime/runtime'
import AragonApi from '@aragon/api'
import {abi as TokenABI} from '../../abi/Token.json'

const api = new AragonApi()
let account

api.store(
  async (state, event) => {
    let newState

    switch (event.event) {
      case 'ACCOUNTS_TRIGGER':
        account = event.returnValues.account
        newState = state
        break
      default:
        newState = state
    }

    return newState
  },
  {
    init: async function(cachedState){
      return {
        ...cachedState,
        tokenName: cachedState.tokenName || await getTokenName()
      }
    }
  }
)

async function getTokenName(){
  const tokenAddress = await api.call('token').toPromise()
  const token = api.external(tokenAddress, TokenABI)
  const name = await token.name().toPromise()
  return name
}
