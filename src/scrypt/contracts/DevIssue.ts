import { SmartContract, method, prop, assert, SigHash, hash256 } from "scrypt-ts";

export default class DevIssue extends SmartContract {

  static readonly VERSION = '0.2.0'

  static readonly NAME = 'DevIssue'

  @prop()
  version: string;

  @prop()
  org: string;

  @prop()
  repo: string;

  @prop()
  issue_number: bigint;

  @prop(true)
  title: string;

  @prop(true)
  description: string;

  constructor(org: string, repo: string, issue_number: bigint, title: string, description: string) {
    super(org, repo, issue_number, title, description);
    this.org = org;
    this.repo = repo;
    this.issue_number = issue_number;
    this.title = title
    this.description = description
  }

  @method(SigHash.SINGLE)
  public setTitle(title: string) {
    this.title = title
    assert(
      this.ctx.hashOutputs == hash256(this.buildStateOutput(this.ctx.utxo.value))
    )
  }

  @method(SigHash.SINGLE)
  public setDescription(description: string) {
    this.description = description
    assert(
      this.ctx.hashOutputs == hash256(this.buildStateOutput(this.ctx.utxo.value))
    )
  }

}

export async function main() {

  const issue = new DevIssue('pow-co', 'pow.co', 175n, 'My Important Issue', 'This is a description')

  let result = issue.verify(() => issue.setTitle('My Important Issue'));

  console.log('demo.verify.unlock.result', result)

  let result2 = issue.verify(() => issue.setDescription('Updated description is better'));

  console.log('demo2.verify.unlock.result', result2)

}

if (require.main === module) {

  main()

  

}
