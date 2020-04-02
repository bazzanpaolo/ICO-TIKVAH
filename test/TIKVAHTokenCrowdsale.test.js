 const ether = (n) => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}
const EVM_REVERT = 'VM Exception while processing transaction: revert'

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

  // Investor caps
  investorMinCap = ether(0.002)
  investorHardCap = ether(50)

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

    describe('buyTokens()', () => {
      describe('when the contribution is less than the minimun cap', () => {
        it('rejects the transaction', async () => {
          const value = investorMinCap - 1
          await crowdsale.buyTokens(investor2, {value: value, from: investor2 }).should.be.rejectedWith(EVM_REVERT)
        })
      })

      describe('when the investor has already met the minimun cap', () => {
        it('allows the investor to contribute below the minimun cap', async () => {
          // First contribution is valid
          const value1 = ether(1)
          await crowdsale.buyTokens(investor1, { value: value1, from: investor1})
          // Second contribution is less than investor cap
          const value2 = 1 // wei
          await crowdsale.buyTokens(investor1, { value: value2, from: investor1}).should.be.fulfilled
        })
      })
    })

    describe('when the total contributions exceed the investor hard cap', () => {
      it('rejects the transaction', async () => {
        // First contribution is  in valid range
        const value1 = ether(2)
        await crowdsale.buyTokens(investor1, { value: value1, from: investor1})
        // Second contribution is less than investor cap
        const value2 = ether(49)
        await crowdsale.buyTokens(investor1, { value: value2, from: investor1}).should.be.rejectedWith(EVM_REVERT)
      })
    })

    describe('when the contributions is within the valid range', () => {
      const value = ether(2)
      it('succeeds & updates the contribution amount', async () => {
        await crowdsale.buyTokens(investor2, { value: value, from: investor2}).should.be.fulfilled
        const contribution = await crowdsale.getUserContribution(investor2)
        contribution.toString().should.equal(value.toString())
      })
    })
  })
})
