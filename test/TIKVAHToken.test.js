const TIKVAHToken = artifacts.require('./TIKVAHToken')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TIKVAHToken', (accounts) => {
  let token

  beforeEach(async () => {
    token = await TIKVAHToken.new()
  })

  describe('deployment', () => {
    it('tracks the name', async () => {
      const result = await token.name()
      result.should.equal('TIKVAH')
    })

    it('tracks the Symbol', async () => {
      const result = await token.symbol()
      result.should.equal('TKVH')
    })

    it('tracks the decimals', async () => {
      const result = await token.decimals()
      result.toString().should.equal('18')
    })
  })
})
