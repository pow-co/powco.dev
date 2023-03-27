require("dotenv").config()

import { Op } from 'sequelize'

import { deployDevIssueContract, fetchDevIssue, DevIssueContract } from './src/scrypt'

import delay from 'delay'

import * as models from './src/models'

import { fetch } from 'powco'

export async function start() {

  const issues = await models.GithubIssue.findAll({

    where: {

      txid: {
        [Op.eq]: null
      }
    }

  })

  for (let issue  of issues) {

    try {

      console.log(issue)

      const { org, repo, issue_id, id } = issue

      const params = {
        version: '0.0.1',
        platform: 'github',
        org,
        repo,
        issue_number: String(issue.data.number),
        title: issue.data.title,
        description: String(issue.data.body)
      }

      console.log('powcodev.deployDevIssueContract', params)

      const result = await deployDevIssueContract(params, 1000)

      console.log('powcodev.deployDevIssueContract.result', result)

      issue.txid = result

      await issue.save()

      const devIssue = await fetchDevIssue(result)

      console.log(devIssue)

      await delay(5000)

    } catch(error) {

      console.error(error)

    }

  }

}

function toJSON(txhex: string): any | null {

  const contract = DevIssueContract.fromTransaction(txhex)

  if (!contract) { return null }

  const props = contract.scriptedConstructor.args.reduce((out, arg: any) => {

    out[arg.name] = Buffer.from(arg.value, 'hex').toString('utf8')

    return out
  }, {})

  let closed = contract.statePropsArgs.find(arg => arg.name === 'closed').value

  return Object.assign(props, { closed })

}


if (require.main === module) {

  start()

}
