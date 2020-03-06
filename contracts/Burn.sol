pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";

contract Burn is AragonApp {
    TokenManager public tokenManager;

    // Errors
    string private constant ERROR_INVALID_TOKEN = "INVALID_TOKEN";

    function initialize(address _tokenManager) onlyInit public {
        initialized();

        tokenManager = TokenManager(_tokenManager);
    }

    function tokensReceived(
        address _operator, address _from, address _to, uint _amount, bytes _data, bytes _operatorData
    ) external {
        require( msg.sender == address(tokenManager.token()), ERROR_INVALID_TOKEN );

        tokenManager.burn(this, _amount);
    }

    function token() public view returns (address) {
        return address(tokenManager.token());
    }

}
