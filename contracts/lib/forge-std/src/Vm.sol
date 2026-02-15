// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface Vm {
    function envOr(string calldata name, uint256 defaultValue) external view returns (uint256 value);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function warp(uint256) external;
    function deal(address who, uint256 newBalance) external;
    function prank(address msgSender) external;
    function expectRevert(bytes4) external;
}
