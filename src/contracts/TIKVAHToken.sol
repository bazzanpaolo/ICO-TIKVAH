pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";

contract TIKVAHToken is ERC20Mintable, ERC20Pausable, ERC20Detailed {
    constructor() public ERC20Detailed("TIKVAH", "TKVH", 18) {

    }
}
