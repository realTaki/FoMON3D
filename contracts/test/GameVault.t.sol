// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/FoMONToken.sol";
import "../src/GameVault.sol";

contract RejectingWinner {
    GameVault public immutable vault;

    constructor(address vaultAddress) {
        vault = GameVault(vaultAddress);
    }

    function depositAsWinner() external payable {
        vault.deposit{value: msg.value}();
    }

    receive() external payable {
        revert("reject eth");
    }
}

contract GameVaultTest is Test {
    FoMONToken token;
    GameVault vault;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        token = new FoMONToken(address(0));
        vault = new GameVault(address(token));
        token.setVault(address(vault));
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
    }

    function test_deposit_mintsFoMON() public {
        uint256 amount = 1 ether;
        vm.prank(alice);
        vault.deposit{value: amount}();
        assertEq(token.balanceOf(alice), amount);
        assertEq(vault.lastDepositor(), alice);
    }

    function test_multipleDeposits_updateLastDepositorAndBalance() public {
        vm.prank(alice);
        vault.deposit{value: 0.5 ether}();
        vm.prank(bob);
        vault.deposit{value: 0.25 ether}();
        assertEq(token.balanceOf(alice), 0.5 ether);
        assertEq(token.balanceOf(bob), 0.25 ether);
        assertEq(vault.lastDepositor(), bob);
    }

    function test_zeroDeposit_reverts() public {
        vm.expectRevert(GameVault.ZeroDeposit.selector);
        vm.prank(alice);
        vault.deposit{value: 0}();
    }

    function test_settleBeforeDeadline_reverts() public {
        vm.expectRevert(GameVault.RoundNotEnded.selector);
        vault.settleRound();
    }

    function test_settleRound_queuesRewardAndCanClaim() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();
        vm.warp(block.timestamp + vault.ROUND_DURATION());
        vault.settleRound();

        assertEq(vault.pendingRewards(alice), 0.8 ether);

        uint256 before = alice.balance;
        vm.prank(alice);
        vault.claimReward();
        assertEq(alice.balance, before + 0.8 ether);
        assertEq(vault.pendingRewards(alice), 0);
    }

    function test_settleRound_doesNotFreezeWithRejectingWinner() public {
        RejectingWinner rejecting = new RejectingWinner(address(vault));
        vm.deal(address(rejecting), 1 ether);
        rejecting.depositAsWinner{value: 1 ether}();

        vm.warp(block.timestamp + vault.ROUND_DURATION());
        vault.settleRound();
        assertEq(vault.pendingRewards(address(rejecting)), 0.8 ether);
    }

    function test_requestRedeem_keepsFirstUnlockForActiveQueue() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();

        vm.prank(alice);
        vault.requestRedeem(0.2 ether);
        uint256 firstUnlock = vault.redeemUnlockAt(alice);

        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        vault.requestRedeem(0.1 ether);
        assertEq(vault.redeemUnlockAt(alice), firstUnlock);
        assertEq(vault.redeemAmount(alice), 0.3 ether);
    }

    function test_claimRedeem_afterDelay() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();
        vm.prank(alice);
        vault.requestRedeem(0.2 ether);

        vm.warp(block.timestamp + vault.REDEEM_DELAY());
        uint256 before = alice.balance;
        vm.prank(alice);
        vault.claimRedeem();
        assertEq(alice.balance, before + 0.2 ether);
        assertEq(vault.redeemAmount(alice), 0);
    }
}
