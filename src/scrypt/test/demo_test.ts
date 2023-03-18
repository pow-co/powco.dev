
import Demo from '../contracts/Demo'

describe('Test SmartContract `Demo`', () => {
  before(async () => {
    await Demo.compile();
  })

  it('should pass the public method unit test successfully.', async () => {
    let demo = new Demo(1n);

    let result = demo.verify(() => demo.unlock(2n));
    expect(result.success, result.error).to.eq(true);

    expect(() => {
      demo.unlock(3n);
    }).to.throw(/Execution failed/)
  })
})
