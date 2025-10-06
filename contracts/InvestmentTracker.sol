// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title InvestmentTracker
 * @dev Track research investments on-chain with NFT certificates
 */
contract InvestmentTracker is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    Counters.Counter private _investmentIds;
    
    struct Investment {
        uint256 id;
        address investor;
        string targetType; // "dao", "grant", "scholarship"
        string targetId;
        uint256 amount;
        uint256 timestamp;
        bool isActive;
        string metadata; // IPFS hash for additional data
    }
    
    struct InvestorProfile {
        uint256 totalInvested;
        uint256 investmentCount;
        uint256 firstInvestmentDate;
        uint256 lastInvestmentDate;
        bool isActive;
    }
    
    // Mappings
    mapping(uint256 => Investment) public investments;
    mapping(address => InvestorProfile) public investorProfiles;
    mapping(address => uint256[]) public investorInvestments;
    mapping(string => uint256[]) public targetInvestments;
    mapping(uint256 => uint256) public certificateToInvestment; // NFT ID to Investment ID
    
    // Events
    event InvestmentMade(
        uint256 indexed investmentId,
        address indexed investor,
        string targetType,
        string targetId,
        uint256 amount,
        uint256 certificateId
    );
    
    event BatchInvestmentMade(
        address indexed investor,
        uint256[] investmentIds,
        uint256 totalAmount
    );
    
    event InvestmentCancelled(
        uint256 indexed investmentId,
        address indexed investor
    );
    
    // Platform fee (in basis points, e.g., 100 = 1%)
    uint256 public platformFeeBps = 100;
    address public feeRecipient;
    
    constructor(
        string memory name,
        string memory symbol,
        address _feeRecipient
    ) ERC721(name, symbol) Ownable(msg.sender) {
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Make a single investment
     */
    function invest(
        string memory targetType,
        string memory targetId,
        string memory metadata
    ) external payable nonReentrant returns (uint256) {
        require(msg.value > 0, "Investment amount must be greater than 0");
        
        // Calculate platform fee
        uint256 fee = (msg.value * platformFeeBps) / 10000;
        uint256 investmentAmount = msg.value - fee;
        
        // Create investment record
        _investmentIds.increment();
        uint256 newInvestmentId = _investmentIds.current();
        
        Investment memory newInvestment = Investment({
            id: newInvestmentId,
            investor: msg.sender,
            targetType: targetType,
            targetId: targetId,
            amount: investmentAmount,
            timestamp: block.timestamp,
            isActive: true,
            metadata: metadata
        });
        
        investments[newInvestmentId] = newInvestment;
        investorInvestments[msg.sender].push(newInvestmentId);
        targetInvestments[targetId].push(newInvestmentId);
        
        // Update investor profile
        _updateInvestorProfile(msg.sender, investmentAmount);
        
        // Mint NFT certificate
        _tokenIds.increment();
        uint256 newCertificateId = _tokenIds.current();
        _safeMint(msg.sender, newCertificateId);
        certificateToInvestment[newCertificateId] = newInvestmentId;
        
        // Transfer platform fee
        if (fee > 0) {
            payable(feeRecipient).transfer(fee);
        }
        
        emit InvestmentMade(
            newInvestmentId,
            msg.sender,
            targetType,
            targetId,
            investmentAmount,
            newCertificateId
        );
        
        return newInvestmentId;
    }
    
    /**
     * @dev Make batch investments (shopping cart checkout)
     */
    function batchInvest(
        string[] memory targetTypes,
        string[] memory targetIds,
        uint256[] memory amounts,
        string[] memory metadataArray
    ) external payable nonReentrant returns (uint256[] memory) {
        require(
            targetTypes.length == targetIds.length &&
            targetIds.length == amounts.length &&
            amounts.length == metadataArray.length,
            "Array lengths must match"
        );
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(msg.value >= totalAmount, "Insufficient payment");
        
        uint256[] memory investmentIds = new uint256[](targetTypes.length);
        uint256 totalInvested = 0;
        
        for (uint256 i = 0; i < targetTypes.length; i++) {
            uint256 fee = (amounts[i] * platformFeeBps) / 10000;
            uint256 investmentAmount = amounts[i] - fee;
            
            _investmentIds.increment();
            uint256 newInvestmentId = _investmentIds.current();
            
            Investment memory newInvestment = Investment({
                id: newInvestmentId,
                investor: msg.sender,
                targetType: targetTypes[i],
                targetId: targetIds[i],
                amount: investmentAmount,
                timestamp: block.timestamp,
                isActive: true,
                metadata: metadataArray[i]
            });
            
            investments[newInvestmentId] = newInvestment;
            investorInvestments[msg.sender].push(newInvestmentId);
            targetInvestments[targetIds[i]].push(newInvestmentId);
            
            // Mint NFT certificate
            _tokenIds.increment();
            uint256 newCertificateId = _tokenIds.current();
            _safeMint(msg.sender, newCertificateId);
            certificateToInvestment[newCertificateId] = newInvestmentId;
            
            investmentIds[i] = newInvestmentId;
            totalInvested += investmentAmount;
            
            // Transfer platform fee
            if (fee > 0) {
                payable(feeRecipient).transfer(fee);
            }
        }
        
        // Update investor profile once for batch
        _updateInvestorProfile(msg.sender, totalInvested);
        
        emit BatchInvestmentMade(msg.sender, investmentIds, totalInvested);
        
        return investmentIds;
    }
    
    /**
     * @dev Get all investments for an investor
     */
    function getInvestorInvestments(address investor) 
        external 
        view 
        returns (Investment[] memory) 
    {
        uint256[] memory investmentIds = investorInvestments[investor];
        Investment[] memory result = new Investment[](investmentIds.length);
        
        for (uint256 i = 0; i < investmentIds.length; i++) {
            result[i] = investments[investmentIds[i]];
        }
        
        return result;
    }
    
    /**
     * @dev Get all investments for a target
     */
    function getTargetInvestments(string memory targetId) 
        external 
        view 
        returns (Investment[] memory) 
    {
        uint256[] memory investmentIds = targetInvestments[targetId];
        Investment[] memory result = new Investment[](investmentIds.length);
        
        for (uint256 i = 0; i < investmentIds.length; i++) {
            result[i] = investments[investmentIds[i]];
        }
        
        return result;
    }
    
    /**
     * @dev Get investor portfolio summary
     */
    function getInvestorPortfolio(address investor)
        external
        view
        returns (
            uint256 totalInvested,
            uint256 investmentCount,
            uint256[] memory recentInvestmentIds
        )
    {
        InvestorProfile memory profile = investorProfiles[investor];
        uint256[] memory allInvestments = investorInvestments[investor];
        
        // Get last 10 investments or all if less than 10
        uint256 recentCount = allInvestments.length < 10 ? allInvestments.length : 10;
        uint256[] memory recent = new uint256[](recentCount);
        
        if (recentCount > 0) {
            uint256 startIndex = allInvestments.length - recentCount;
            for (uint256 i = 0; i < recentCount; i++) {
                recent[i] = allInvestments[startIndex + i];
            }
        }
        
        return (
            profile.totalInvested,
            profile.investmentCount,
            recent
        );
    }
    
    /**
     * @dev Update investor profile stats
     */
    function _updateInvestorProfile(address investor, uint256 amount) private {
        InvestorProfile storage profile = investorProfiles[investor];
        
        if (!profile.isActive) {
            profile.firstInvestmentDate = block.timestamp;
            profile.isActive = true;
        }
        
        profile.totalInvested += amount;
        profile.investmentCount += 1;
        profile.lastInvestmentDate = block.timestamp;
    }
    
    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Fee cannot exceed 10%");
        platformFeeBps = newFeeBps;
    }
    
    /**
     * @dev Update fee recipient (only owner)
     */
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid address");
        feeRecipient = newRecipient;
    }
    
    /**
     * @dev Get investment details by NFT certificate ID
     */
    function getInvestmentByCertificate(uint256 certificateId) 
        external 
        view 
        returns (Investment memory) 
    {
        require(_ownerOf(certificateId) != address(0), "Certificate does not exist");
        uint256 investmentId = certificateToInvestment[certificateId];
        return investments[investmentId];
    }
    
    /**
     * @dev Override to make NFTs non-transferable (soulbound)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting but prevent transfers
        if (from != address(0) && to != address(0)) {
            revert("Investment certificates are non-transferable");
        }
        
        return super._update(to, tokenId, auth);
    }
}