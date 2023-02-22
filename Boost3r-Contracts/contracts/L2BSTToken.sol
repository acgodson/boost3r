// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {L2StandardERC20} from "@mantleio/contracts/standards/L2StandardERC20.sol";

contract WETH9 {
    function deposit() external payable {}

    function withdraw(uint256 wad) public {}

    function approve(address guy, uint256 wad) public returns (bool) {}

    function transferFrom(
        address src,
        address dst,
        uint256 wad
    ) public returns (bool) {}

    function transfer(address dst, uint256 wad) public returns (bool) {}
}

contract L2BSTToken is ERC20 {
    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private exchangeRate = 1; // suggested exchange rate, for example
    WETH9 private wethToken;
    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);

    constructor() ERC20("Boost3r Token", "BST") {
        wethToken = WETH9(address(0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111));
    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(
            _balances[msg.sender] >= amount,
            "ERC20: transfer amount exceeds balance"
        );

        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        require(sender != address(0), "Transfer from the zero address");
        require(recipient != address(0), "Transfer to the zero address");
        require(_balances[sender] >= amount, "Transfer amount exceeds balance");
        require(
            _allowances[sender][msg.sender] >= amount,
            "Transfer amount exceeds allowance"
        );
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        _allowances[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function deposit(uint256 amount, address recipient) public payable {
        require(amount > 0, "Must send tokens greater than 0");

        // Then, we can transfer the tokens to the contract.
        require(
            wethToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        uint256 tokensToMint = amount * exchangeRate;

        _totalSupply += tokensToMint;
        _mint(msg.sender, tokensToMint);
        _balances[recipient] += tokensToMint;
        emit Deposit(recipient, tokensToMint);
    }

    function withdraw(uint256 amount) public {
        require(
            _balances[msg.sender] >= amount,
            "Boost3rToken: Not enough tokens to withdraw"
        );
        uint256 wETHTokenAmount = amount * exchangeRate;
        _burn(msg.sender, amount);
        _balances[msg.sender] -= amount;
        wethToken.transfer(msg.sender, wETHTokenAmount);
        emit Withdrawal(msg.sender, amount);
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
}
