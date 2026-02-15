// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../src/FoMONToken.sol";
import "../src/GameVault.sol";

interface Vm {
    function envOr(string calldata name, uint256 defaultValue) external view returns (uint256 value);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
}

contract DeployScript {
    // Foundry vm precompile
    Vm constant vm = Vm(address(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D));

    function run() external {
        uint256 pk = vm.envOr("PRIVATE_KEY", uint256(0));
        if (pk == 0) pk = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        vm.startBroadcast(pk);

        FoMONToken token = new FoMONToken(address(0));
        GameVault vault = new GameVault(address(token));
        token.setVault(address(vault));

        vm.stopBroadcast();
    }
}
