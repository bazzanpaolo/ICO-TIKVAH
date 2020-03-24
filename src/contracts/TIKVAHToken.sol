pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract TIKVAHToken is ERC20Mintable, ERC20Pausable, ERC20Detailed {
    constructor() public ERC20Detailed("TIKVAH", "TKVH", 18) {

    }
}
