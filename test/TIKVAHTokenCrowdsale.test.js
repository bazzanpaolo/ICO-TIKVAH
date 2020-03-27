 const ether = (n) => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

const TIKVAHToken = artifacts.require('./TIKVAHToken')
const TIKVAHTokenCrowdsale = artifacts.require('./TIKVAHTokenCrowdsale')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TIKVAHTokenCrowdsale', ([_, wallet, investor1, investor2,]) => {
let rate
let token


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
    // Transfer token ownership to crowdsale
     await token.transferOwnership(crowdsale.address);
  });

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

  describe('accepting payments', () => {
     it('should accept payments', async () => {
       const value = ether(1)
       await crowdsale.sendTransactio({value: value, from: investor1})
     })
    })
  })
})
