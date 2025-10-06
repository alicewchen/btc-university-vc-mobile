// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleResearchDAO
 * @dev Simplified research DAO for testing purposes
 */
contract SimpleResearchDAO {
    string public tokenName;
    string public tokenSymbol;
    string public daoName;
    string public description;
    string public researchFocus;
    
    uint256 public totalSupply;
    uint256 public proposalThreshold;
    uint256 public votingDuration;
    uint256 public quorumPercentage;
    
    address public creator;
    mapping(address => uint256) public balances;
    mapping(address => bool) public members;
    address[] public memberAddresses;
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        string researchArea;
        uint256 fundingRequested;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        bool approved;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256[] public activeProposals;
    uint256[] public activeProjects;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId, bool approved);
    event MemberJoined(address indexed member, string name, string role);
    event FundsReceived(address indexed from, uint256 amount);
    
    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _daoName,
        string memory _description,
        string memory _researchFocus,
        uint256 _initialSupply,
        uint256 _proposalThreshold,
        uint256 _votingDuration,
        uint256 _quorumPercentage,
        address _creator
    ) {
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        daoName = _daoName;
        description = _description;
        researchFocus = _researchFocus;
        totalSupply = _initialSupply * 10**18;
        proposalThreshold = _proposalThreshold * 10**18;
        votingDuration = _votingDuration;
        quorumPercentage = _quorumPercentage;
        creator = _creator;
        
        // Give initial supply to creator
        balances[_creator] = totalSupply;
        members[_creator] = true;
        memberAddresses.push(_creator);
    }
    
    function joinDAO(string memory _name, string memory _role) external {
        require(!members[msg.sender], "Already a member");
        members[msg.sender] = true;
        memberAddresses.push(msg.sender);
        emit MemberJoined(msg.sender, _name, _role);
    }
    
    function createProposal(
        string memory _title,
        string memory _description,
        string memory _researchArea,
        uint256 _fundingRequested
    ) external returns (uint256) {
        require(members[msg.sender], "Must be a member to create proposals");
        require(balances[msg.sender] >= proposalThreshold, "Insufficient tokens for proposal");
        
        uint256 proposalId = proposalCount++;
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: _title,
            description: _description,
            researchArea: _researchArea,
            fundingRequested: _fundingRequested,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + (votingDuration * 1 days),
            executed: false,
            approved: false
        });
        
        activeProposals.push(proposalId);
        emit ProposalCreated(proposalId, msg.sender, _title);
        
        return proposalId;
    }
    
    function getDAOInfo() external view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256[] memory,
        uint256[] memory,
        uint256,
        address[] memory
    ) {
        return (
            tokenName,
            tokenSymbol,
            daoName,
            description,
            researchFocus,
            totalSupply,
            proposalThreshold,
            votingDuration,
            quorumPercentage,
            address(this).balance,
            activeProposals,
            activeProjects,
            memberAddresses.length,
            memberAddresses
        );
    }
    
    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }
    
    function getActiveProposals() external view returns (uint256[] memory) {
        return activeProposals;
    }
    
    function getActiveProjects() external view returns (uint256[] memory) {
        return activeProjects;
    }
    
    function getMemberAddresses() external view returns (address[] memory) {
        return memberAddresses;
    }
    
    function fundDAO() external payable {
        require(msg.value > 0, "Must send some ETH");
        emit FundsReceived(msg.sender, msg.value);
    }
    
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
}