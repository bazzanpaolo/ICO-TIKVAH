// Returns the time of the last mined block in seconds
function latestTime () {
  return web3.eth.getBlock('latest').timestamp;
}
// Increases ganache time by the passed duration in seconds
function increaseTime (duration) {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1);

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id + 1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res);
      });
    });
  });
}
/**
 * Beware that due to the need of calling two separate ganache methods and rpc calls overhead
 * it's hard to increase time precisely to a target point so design your test to tolerate
 * small fluctuations from time to time.
 *
 * @param target time in seconds
 */
function increaseTimeTo(target) {
  let now = latestTime();
  if (target < now) throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`);
  let diff = target - now;
  return increaseTime(diff);
}

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};
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
          openingTime = latestTime() + duration.weeks(1)
          closingTime = openingTime + duration.weeks(1)

  // Investor caps
  investorMinCap = ether(0.002)
  investorHardCap = ether(50)

    crowdsale = await TIKVAHTokenCrowdsale.new(
      rate,
      wallet,
      token.address,
      cap,
      openingTime,
      closingTime
    )
    // Transfer token ownership to crowdsale
      await token.addMinter(crowdsale.address);
    // Advance time to crowdsale start
      await increaseTimeTo(openingTime + (1));
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

  describe('timed crowdsale', () => {
    it('is open', async () => {
      const isClosed = await crowdsale.hasClosed()
      isClosed.should.be.false;
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
