// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title FoMONToken - ERC-20 share token for FoMON3D treasury
/// @notice Only the GameVault can mint. Users get FoMON when they deposit.
contract FoMONToken {
    string public constant name = "FoMON Share";
    string public constant symbol = "FoMON";
    uint8 public constant decimals = 18;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address public vault;
    address public immutable owner;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    error OnlyVault();
    error VaultAlreadySet();
    error Unauthorized();
    error InsufficientBalance();
    error InsufficientAllowance();
    error ZeroAddress();

    constructor(address _vault) {
        vault = _vault;
        owner = msg.sender;
    }

    /// @notice Set vault once (for two-step deploy: Token with 0, then Vault, then setVault).
    function setVault(address _vault) external {
        if (msg.sender != owner) revert Unauthorized();
        if (vault != address(0)) revert VaultAlreadySet();
        if (_vault == address(0)) revert ZeroAddress();
        vault = _vault;
    }

    modifier onlyVault() {
        if (msg.sender != vault) revert OnlyVault();
        _;
    }

    function mint(address to, uint256 amount) external onlyVault {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function burn(address from, uint256 amount) external onlyVault {
        if (balanceOf[from] < amount) revert InsufficientBalance();
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        if (to == address(0)) revert ZeroAddress();
        if (balanceOf[msg.sender] < amount) revert InsufficientBalance();
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        if (to == address(0)) revert ZeroAddress();
        if (allowance[from][msg.sender] < amount) revert InsufficientAllowance();
        if (balanceOf[from] < amount) revert InsufficientBalance();
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}
