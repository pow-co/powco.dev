
import { Bsm, Address, PubKey } from 'bsv-2'

const atob = require('atob')

const axios = require('axios')

export async function listTokenBalances(address: string): Promise<any> {

    const { data } = await axios.get(`https://staging-backend.relayx.com/api/user/balance2/${address}`)

    return data.data

}

interface RelayoneAuthTokenJSON {
  issued_at: number;
  paymail: string;
  origin: string;
  pubkey: string;
}

export function validateAuthToken(relayoneAuthToken: string): RelayoneAuthTokenJSON | false {

  console.log('server.handlers.github_tokens.create', {relayoneAuthToken})

  const [relayonePayloadBase64, relayoneSignature] = relayoneAuthToken.split(".")

  console.log('relayone.auth.signature', relayoneSignature)

  const relayoneAuthTokenJSON = JSON.parse(atob(relayonePayloadBase64));

  console.log('relayone.auth.token', relayoneAuthTokenJSON)

  console.log('relayone.auth.token', relayoneAuthTokenJSON)

  const pubkey = PubKey.fromString(relayoneAuthTokenJSON.pubkey)

  console.log('relayone.auth.pubkey', pubkey)

  const address = new Address().fromPubKey(pubkey)

  console.log('verify', {
      relayonePayloadBase64,
      relayoneSignature,
      address: address.toString()
  })

  const verified = Bsm.verify(Buffer.from(relayonePayloadBase64), relayoneSignature, address)

  console.log('relayone.auth.token.verification', verified)

  if (verified) {

    return relayoneAuthTokenJSON

  } else {

    return false
    
  }

}
