pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";


contract TIKVAHTokenCrowdsale is Crowdsale, MintedCrowdsale {
    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token
    )
        MintedCrowdsale()
        Crowdsale(rate, wallet, token)
        public
    {

    }
}
