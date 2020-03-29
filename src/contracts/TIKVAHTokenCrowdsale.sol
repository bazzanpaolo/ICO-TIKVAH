pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract TIKVAHTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale {

  // Track investor contributions
    uint256 public investorMinCap = 2000000000000000; // 0.002 Ether
    uint256 public investorHardCap = 50000000000000000000; // 50 Ether
    mapping(address => uint256) public contributions;

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token,
        uint256 cap
    )
        Crowdsale(rate, wallet, token)
    CappedCrowdsale(cap)
    public
    {

    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal {
        super._preValidatePurchase(beneficiary, weiAmount);
        uint256 _existingContribution = contributions[beneficiary];
        uint256 _newContribution = _existingContribution.add(weiAmount);
        require(_newContribution >= investorMinCap && _newContribution <= investorMinCap);
        contributions[beneficiary] = _newContribution;
    }
}
