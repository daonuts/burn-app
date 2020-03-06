import React, { useState, useEffect } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
  AppBar, AppView, Button, Card, CardLayout, Checkbox, Field, GU, Header, IconSettings,
  Info, Paragraph, Main, Modal, SidePanel, Text, TextInput, theme
} from '@aragon/ui'
import BigNumber from 'bignumber.js'
import {abi as TokenABI} from '../../abi/Token.json'
import { ethers } from 'ethers'
const { utils } = ethers

function App() {
  const { api, network, appState, connectedAccount, currentApp } = useAragonApi()
  const { syncing, tokenName } = appState

  const [amount, setAmount] = useState(0)

  return (
    <Main>
      <Header primary={`Burn [${tokenName}]`} />
      <Field label="Amount:">
        <TextInput type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} />
      </Field>
      <Field>
        <Button mode="strong" emphasis="positive" onClick={()=>burn(api, currentApp.appAddress, amount)}>Burn</Button>
      </Field>
    </Main>
  )
}

async function burn(api, burner, amount){

  const { utils } = ethers
  const { hexStripZeros, hexDataSlice, solidityPack, defaultAbiCoder, Interface, formatBytes32String, parseBytes32String, toUtf8Bytes, toUtf8String, hexlify, hexZeroPad, bigNumberify } = utils

  const decimals = "1000000000000000000"

  let value = bigNumberify(amount).mul(decimals);

  let tokenAddress = await api.call('token').toPromise()

  console.log(burner, tokenAddress, value, value.toString())

  // let iface = new Interface([{
  //   "inputs": [
  //     {
  //       "name": "contentId",
  //       "type": "bytes12"
  //     }
  //   ],
  //   "name": "redditTipV1",
  //   "type": "function"
  // }])
  // console.log("sighash", iface.functions.redditTipV1.sighash)
  // const encoded = iface.functions.redditTipV1.encode([hexZeroPad(hexlify(toUtf8Bytes(contentId)),12)])
  // console.log(encoded)

  // const args = "0x" + [
  //   iface.functions.redditTipV1.sighash,
  //   contentId
  // ].map(a=>a.substr(2)).join("")

  // const resSigHash = hexDataSlice(encoded, 0, 4)
  // console.log(resSigHash, resSigHash === iface.functions.redditTipV1.sighash)
  // const resContentId = defaultAbiCoder.decode(["bytes12"], hexDataSlice(encoded, 4))[0]
  // console.log(resContentId)
  // console.log(toUtf8String(hexStripZeros(resContentId)))

  const token = api.external(tokenAddress, TokenABI)

  console.log(token)

  const tx = await token.send(burner, value.toString(), "0x0").toPromise()
  console.log(tx)

}

export default App
