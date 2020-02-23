const TIKVAHToken = artifacts.require('./TIKVAHToken')
const TIKVAHTokenCrowdsale = artifacts.require('./TIKVAHTokenCrowdsale')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TIKVAHTokenCrowdsale', ([_, wallet]) => {
let rate

  beforeEach(async () => {
    const name = 'TIKVAH'
    const symbol = 'TKVH'
    const decimal = '18'

   // Deploy Token
    token = await TIKVAHToken.new()

   // Crowdsale config
    const rate = '500'

    crowdsale = await TIKVAHTokenCrowdsale.new(
      rate,
      wallet,
      token.address
    )
  })

  describe('crowdsale', () => {
    it('tracks the token', async () => {
      const result = await crowdsale.token()
      result.should.equal(token.address)
    })

    it('tracks the rate', async () => {
      const result = await crowdsale.rate()
      result.toString().should.equal('500')
    })

    it('tracks the wallet', async () => {
      const result = await crowdsale.wallet()
      result.should.equal(wallet)
    })
  })
})
