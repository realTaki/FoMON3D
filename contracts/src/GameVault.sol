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
    mapping(address => uint256) public pendingRewards;
    uint256 public totalPendingRewards;

    event Deposited(address indexed user, uint256 amount, uint256 newDeadline);
    event RoundSettled(uint256 indexed roundId, address indexed winner, uint256 reward);
    event RewardQueued(address indexed winner, uint256 reward);
    event RewardClaimed(address indexed winner, uint256 reward);
    event RedeemRequested(address indexed user, uint256 amount, uint256 unlockAt);
    event RedeemClaimed(address indexed user, uint256 amount);

    error RoundNotEnded();
    error ZeroDeposit();
    error ZeroRedeem();
    error RedeemNotUnlocked();
    error NoPendingReward();
    error InsufficientLiquidity();
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

    /// @notice When deadline passed, anyone can settle. 80% of currently available balance is queued to winner.
    /// @dev Uses pull-payments to avoid freezing rounds when winner cannot receive ETH.
    function settleRound() external {
        if (block.timestamp < deadline) revert RoundNotEnded();
        address winner = lastDepositor;
        uint256 reward = (_availableLiquidity() * REWARD_BPS) / 10000;
        roundId++;
        deadline = block.timestamp + ROUND_DURATION;
        lastDepositor = address(0);
        if (reward > 0 && winner != address(0)) {
            pendingRewards[winner] += reward;
            totalPendingRewards += reward;
            emit RewardQueued(winner, reward);
        }
        emit RoundSettled(roundId - 1, winner, reward);
    }

    /// @notice Claim queued winner rewards.
    function claimReward() external {
        uint256 reward = pendingRewards[msg.sender];
        if (reward == 0) revert NoPendingReward();
        pendingRewards[msg.sender] = 0;
        totalPendingRewards -= reward;
        (bool ok,) = msg.sender.call{value: reward}("");
        require(ok, "Reward transfer failed");
        emit RewardClaimed(msg.sender, reward);
    }

    /// @notice Request redeem: burn FoMON and queue MON withdrawal.
    /// @dev Additional requests before unlock do not extend unlock time.
    function requestRedeem(uint256 amount) external {
        if (amount == 0) revert ZeroRedeem();
        if (fomonToken.balanceOf(msg.sender) < amount) revert InsufficientFoMON();
        uint256 unlockAt = redeemUnlockAt[msg.sender];
        if (unlockAt == 0 || unlockAt < block.timestamp) {
            unlockAt = block.timestamp + REDEEM_DELAY;
            redeemUnlockAt[msg.sender] = unlockAt;
        }
        redeemAmount[msg.sender] += amount;
        fomonToken.burn(msg.sender, amount);
        emit RedeemRequested(msg.sender, amount, unlockAt);
    }

    /// @notice Claim MON after redeem delay.
    function claimRedeem() external {
        uint256 amount = redeemAmount[msg.sender];
        if (amount == 0) revert ZeroRedeem();
        if (block.timestamp < redeemUnlockAt[msg.sender]) revert RedeemNotUnlocked();
        if (amount > _availableLiquidity()) revert InsufficientLiquidity();
        redeemAmount[msg.sender] = 0;
        redeemUnlockAt[msg.sender] = 0;
        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok, "Redeem transfer failed");
        emit RedeemClaimed(msg.sender, amount);
    }

    /// @notice Current countdown end timestamp (for frontend).
    function getDeadline() external view returns (uint256) {
        return deadline;
    }

    function _availableLiquidity() internal view returns (uint256) {
        uint256 vaultBalance = address(this).balance;
        if (vaultBalance <= totalPendingRewards) return 0;
        return vaultBalance - totalPendingRewards;
    }
}
