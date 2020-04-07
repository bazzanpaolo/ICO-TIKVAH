pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";


contract TIKVAHTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale, TimedCrowdsale, WhitelistCrowdsale, RefundableCrowdsale {

  // Track investor contributions
    uint256 public investorMinCap = 2000000000000000; // 0.002 Ether
    uint256 public investorHardCap = 50000000000000000000; // 50 Ether
    mapping(address => uint256) public contributions;

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token,
        uint256 cap,
        uint256 openingTime,
        uint256 closingTime,
        uint256 goal
    )
    Crowdsale(rate, wallet, token)
    CappedCrowdsale(cap)
    TimedCrowdsale(openingTime, closingTime)
    RefundableCrowdsale(goal)
    public
    {
        require(goal <= cap);
    }

    /**
     * @dev Returns the amount contributed so far by a specific user
     * dev Restituisce l'importo contribuito finora da un utente specifico
     * @param beneficiary Address of contributor
     * beneficiario Indirizzo del collaboratore
     * @return User contribution so far
     * return Contributo dell'utente finora
     */
    function getUserContribution(address beneficiary)
    public view returns (uint256)
    {
        return contributions[beneficiary];
    }

    /**
     * @dev Extend parent behavior requiring purchase to respect investor min/max funding cap.
     * @param beneficiary Token purchaser
     * @param weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal onlyWhileOpen view {
        super._preValidatePurchase(beneficiary, weiAmount);
        uint256 _existingContribution = contributions[beneficiary];
        uint256 _newContribution = _existingContribution.add(weiAmount);
        require(_newContribution >= investorMinCap && _newContribution <= investorHardCap);
        contributions[beneficiary] = _newContribution;
    }
}
