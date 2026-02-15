// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "../src/FoMONToken.sol";
import "../src/GameVault.sol";

contract DeployScript is Script {
    function run() external {
        uint256 pk = vm.envOr("PRIVATE_KEY", uint256(0));
        if (pk == 0) pk = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        vm.startBroadcast(pk);

        FoMONToken token = new FoMONToken(address(0));
        GameVault vault = new GameVault(address(token));
        token.setVault(address(vault));

        vm.stopBroadcast();

        console2.log("FoMONToken:", address(token));
        console2.log("GameVault:", address(vault));
    }
}
