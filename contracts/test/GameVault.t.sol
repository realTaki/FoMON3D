// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../src/FoMONToken.sol";
import "../src/GameVault.sol";

contract GameVaultTest {
    FoMONToken token;
    GameVault vault;

    function setUp() public {
        token = new FoMONToken(address(0));
        vault = new GameVault(address(token));
        token.setVault(address(vault));
    }

    function test_deposit_mintsFoMON() public payable {
        uint256 amount = 1 ether;
        require(address(this).balance >= amount, "test contract needs ETH");
        (bool ok,) = address(vault).call{value: amount}(abi.encodeWithSelector(GameVault.deposit.selector));
        require(ok, "deposit failed");
        assert(token.balanceOf(address(this)) == amount);
        assert(vault.lastDepositor() == address(this));
    }

    receive() external payable {}
}
