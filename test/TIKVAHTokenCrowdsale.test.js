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
          wallet = wallet
          cap = ether(100)

    crowdsale = await TIKVAHTokenCrowdsale.new(
      rate,
      wallet,
      token.address,
      cap
    )
    // Transfer token ownership to crowdsale
      await token.addMinter(crowdsale.address);
  });

  describe('crowdsale', () => {
    it('tracks the rate', async () => {
      const result = await crowdsale.rate()
      result.toString().should.equal('500')
    })

    it('tracks the wallet', async () => {
      const result = await crowdsale.wallet()
      result.should.equal(wallet)
    })

    it('tracks the token', async () => {
      const result = await crowdsale.token()
      result.should.equal(token.address)
    })

  describe('minted crowdsale', () => {
    it('mints token after purchase', async () => {
      const originalTotalSupply = await token.totalSupply()
      await crowdsale.sendTransaction({ value: ether(1), from: investor1 })
      const newTotalSupply = await token.totalSupply()
      assert.isTrue(newTotalSupply > originalTotalSupply)
    })
  })

  describe('capped crowdsale', async () => {
    it('has the correct hard cap', async () => {
      result = await crowdsale.cap()
      result.toString().should.equal(cap.toString())
    })

  })
  describe('accepting payments', () => {
    it('should accept payments', async () => {
      const value = ether(1)
      const purchaser = investor2
      await crowdsale.sendTransaction({value: value, from: investor1}).should.be.fulfilled
      await crowdsale.buyTokens(investor1, {value: value, from: purchaser }).should.be.fulfilled
     })
    })
  })
})
