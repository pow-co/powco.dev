
//import { powcodev } from 'stag-wallet'
import { powcodev } from '/Users/zyler/github/pow-co/stag-wallet/src'


import { badRequest } from 'boom'

export async function show(req, h) {

  const { txid } = req.params

  try {

    const issue = await powcodev.fetchDevIssue(txid)

    return issue

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}
