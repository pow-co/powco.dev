
import { fetch } from 'powco'

interface DevIssue {
  version: string;
  platform: string;
  org: string;
  repo: string;
  issue_number: string;
  title: string;
  description: string;
  closed?: boolean;
}

import { join } from 'path'

import * as scrypt from 'scryptlib'

import { readFileSync } from 'fs'

import * as bsv from 'bsv'

const { buildContractClass } = scrypt

import { Wallet, Actor, loadWallet } from  'stag-wallet'

let wallet: Wallet

export async function deployDevIssueContract(devIssue: DevIssue, satoshis: number): Promise<string> {

  const { issue, lockingScript } = await buildContractForDevIssue(devIssue)

  console.log(issue, {
    lockingScript: {
      hex: lockingScript,
      asm: issue.lockingScript.toString()
    }
  })

  if (!wallet) {

     wallet = await loadWallet()
  }

  const actor = new Actor({ wallet })

  const result = await actor.publishScript({
    script: issue.lockingScript,
    satoshis
  })

  return result

}


export function loadArtifact(fileName) {
  return JSON.parse(readFileSync(fileName).toString());
}

const artifact = join(__dirname, 'DevIssue.json')

const DevIssueContract = buildContractClass(loadArtifact(artifact))

export { DevIssueContract }

export async function createIssue() {

}

export async function findIssue() {

}

export async function findOrCreateIssue() {

}

export async function buildContractForDevIssue({
  version,
  platform,
  org,
  repo,
  issue_number,
  title,
  description,
}: DevIssue) {

  const issue = new DevIssueContract(
    Buffer.from(version).toString('hex'),
    Buffer.from(platform).toString('hex'),
    Buffer.from(org).toString('hex'),
    Buffer.from(repo).toString('hex'),
    Buffer.from(issue_number).toString('hex'),
    Buffer.from(title).toString('hex'),
    Buffer.from(description).toString('hex')
  );

  return {
    issue: issue,
    lockingScript: issue.lockingScript.toBuffer().toString('hex')
  }

}

export function parseDevIssueFromRawTransaction(txhex: string): DevIssue | null {

  const contract = DevIssueContract.fromTransaction(txhex)

  if (!contract) { return null }

  const props: any = contract.scriptedConstructor.args.reduce((out, arg: any) => {

    out[arg.name] = Buffer.from(arg.value, 'hex').toString('utf8')

    return out
  }, {})

  let closed = contract.statePropsArgs.find(arg => arg.name === 'closed').value

  return Object.assign(props, { closed })

}

export async function fetchDevIssue(txid: string): Promise<DevIssue> {

  const txhex = await fetch(txid)

  return parseDevIssueFromRawTransaction(txhex)
  
}
