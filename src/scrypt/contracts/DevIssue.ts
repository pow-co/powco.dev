
import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    SigHash,
    PubKey
} from 'scrypt-ts'

export class DevIssue extends SmartContract {

    @prop(true)
    closed: boolean;

    @prop()
    version: ByteString;

    @prop()
    platform: ByteString;
 
    @prop()
    org: ByteString;

    @prop()
    repo: ByteString;

    @prop()
    issue_number: ByteString;

    @prop()
    title: ByteString;

    @prop()
    description: ByteString;

    constructor(
      version: ByteString,
      platform: ByteString,
      org: ByteString,
      repo: ByteString,
      issue_number: ByteString,
      title: ByteString,
      description: ByteString,
    ) {
        super(version, platform, org, repo, issue_number, title, description)

        this.version = version
        this.platform = platform
        this.org = org
        this.repo = repo
        this.issue_number = issue_number
        this.title = title
        this.description = description
        this.closed = false
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public closeIssue() {
        this.closed = true
        // make sure balance in the contract does not change
        const amount: bigint = this.ctx.utxo.value
        // output containing the latest state
        const output: ByteString = this.buildStateOutput(amount)
        // verify current tx has this single output
        assert(this.ctx.hashOutputs === hash256(output), 'hashOutputs mismatch')
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public reopenIssue() {
        this.closed = false
        // make sure balance in the contract does not change
        const amount: bigint = this.ctx.utxo.value
        // output containing the latest state
        const output: ByteString = this.buildStateOutput(amount)
        // verify current tx has this single output
        assert(this.ctx.hashOutputs === hash256(output), 'hashOutputs mismatch')
    }
}

export async function main() {

  const issue = new DevIssue('0.0.1', 'github', 'pow-co', 'pow.co', '175', 'My Important Issue', 'This is a description')

  console.log(issue)
}

if (require.main === module) {

  main()

  

}
