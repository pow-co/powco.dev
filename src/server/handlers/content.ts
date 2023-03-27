
import { parseDevIssueFromRawTransaction } from '../../scrypt'

import * as models from '../../models'

import { fetch } from 'powco'

import { badRequest } from 'boom'

export async function show(req, h) {

  const { txid } = req.params

  let txhex: string;

  try {

    const record = await models.GithubIssue.findOne({
      where: { txid }
    })

    if (!record) {

    }

    txhex = record.txhex

    if (!txhex) {

      txhex = await fetch(txid)

    }

    const issue = await parseDevIssueFromRawTransaction(txhex)

    return Object.assign(issue, { txid, txhex })

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

