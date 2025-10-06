// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleBUFeeRouter
 * @dev Simplified fee router for testing purposes
 */
contract SimpleBUFeeRouter {
    address public owner;
    uint256 public creationFee = 0.01 ether;
    
    event FeeCollected(address indexed from, uint256 amount);
    event CreationFeeUpdated(uint256 newFee);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function setCreationFee(uint256 _fee) external onlyOwner {
        creationFee = _fee;
        emit CreationFeeUpdated(_fee);
    }
    
    function collectFee() external payable {
        require(msg.value >= creationFee, "Insufficient fee");
        emit FeeCollected(msg.sender, msg.value);
    }
    
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    receive() external payable {
        emit FeeCollected(msg.sender, msg.value);
    }
}