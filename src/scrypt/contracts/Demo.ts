import { SmartContract, method, prop, assert } from "scrypt-ts";

export default class Demo extends SmartContract {
  //@ts-ignore
  @prop()
  x: bigint;

  constructor(x: bigint) {
    super(x);
    this.x = x;
  }

  //@ts-ignore
  @method()
  public unlock(x: bigint) {
    assert(this.add(this.x, 1n) === x);
  }

  //@ts-ignore
  @method()
  add(x0: bigint, x1:bigint) : bigint {
    return x0 + x1;
  }
}

export async function main() {

  const demo = await Demo.compile()  

  //@ts-ignore
  let result = demo.verify(() => demo.unlock(2n));

  console.log('demo.verify.unlock.result', result)

}

if (require.main === module) {

  main()

  

}
