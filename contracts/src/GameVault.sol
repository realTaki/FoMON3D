// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./FoMONToken.sol";

/// @title GameVault - FOMO round + deposit + mint FoMON + settle winner + redeem stub
/// @notice Accepts native ETH as "MON" for MVP. Each deposit mints 1:1 FoMON and resets 30s countdown.
contract GameVault {
    FoMONToken public immutable fomonToken;

    uint256 public constant ROUND_DURATION = 30; // seconds
    uint256 public constant REWARD_BPS = 8000;   // 80% to winner, 20% stays in vault

    uint256 public roundId;
    uint256 public deadline;      // timestamp when current round ends
    address public lastDepositor;

    // redeem queue: user => (requested amount, unlock timestamp)
    mapping(address => uint256) public redeemAmount;
    mapping(address => uint256) public redeemUnlockAt;
    uint256 public constant REDEEM_DELAY = 7 days;

    event Deposited(address indexed user, uint256 amount, uint256 newDeadline);
    event RoundSettled(uint256 indexed roundId, address indexed winner, uint256 reward);
    event RedeemRequested(address indexed user, uint256 amount, uint256 unlockAt);

    error RoundNotEnded();
    error ZeroDeposit();
    error ZeroRedeem();
    error RedeemNotUnlocked();
    error InsufficientFoMON();

    constructor(address _fomonToken) {
        fomonToken = FoMONToken(payable(_fomonToken));
        roundId = 1;
        deadline = block.timestamp + ROUND_DURATION;
    }

    /// @notice Deposit native ETH. Mints 1:1 FoMON to sender and resets countdown.
    function deposit() external payable {
        if (msg.value == 0) revert ZeroDeposit();
        lastDepositor = msg.sender;
        deadline = block.timestamp + ROUND_DURATION;
        fomonToken.mint(msg.sender, msg.value);
        emit Deposited(msg.sender, msg.value, deadline);
    }

    /// @notice When deadline passed, anyone can settle. Winner gets 80% of round deposits (simplified: we use vault balance share).
    function settleRound() external {
        if (block.timestamp < deadline) revert RoundNotEnded();
        address winner = lastDepositor;
        uint256 vaultBalance = address(this).balance;
        uint256 reward = (vaultBalance * REWARD_BPS) / 10000;
        roundId++;
        deadline = block.timestamp + ROUND_DURATION;
        lastDepositor = address(0);
        if (reward > 0 && winner != address(0)) {
            (bool ok,) = winner.call{value: reward}("");
            require(ok, "Transfer failed");
        }
        emit RoundSettled(roundId - 1, winner, reward);
    }

    /// @notice Request redeem: lock FoMON and set unlock time. MVP does not implement claimRedeem.
    function requestRedeem(uint256 amount) external {
        if (amount == 0) revert ZeroRedeem();
        if (fomonToken.balanceOf(msg.sender) < amount) revert InsufficientFoMON();
        redeemAmount[msg.sender] += amount;
        redeemUnlockAt[msg.sender] = block.timestamp + REDEEM_DELAY;
        fomonToken.burn(msg.sender, amount);
        emit RedeemRequested(msg.sender, amount, block.timestamp + REDEEM_DELAY);
    }

    /// @notice Current countdown end timestamp (for frontend).
    function getDeadline() external view returns (uint256) {
        return deadline;
    }
}
