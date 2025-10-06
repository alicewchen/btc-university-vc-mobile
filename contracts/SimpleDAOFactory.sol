// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SimpleResearchDAO.sol";
import "./SimpleBUFeeRouter.sol";

/**
 * @title SimpleDAOFactory
 * @dev Simplified factory for creating research DAOs
 */
contract SimpleDAOFactory {
    SimpleBUFeeRouter public feeRouter;
    address[] public deployedDAOs;
    mapping(string => bool) public nameExists;
    mapping(string => address) public nameToDAO;
    
    event DAOCreated(
        address indexed daoAddress,
        string name,
        address indexed creator,
        uint256 timestamp
    );
    
    constructor(address payable _feeRouter) {
        feeRouter = SimpleBUFeeRouter(_feeRouter);
    }
    
    function createResearchDAO(
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _daoName,
        string memory _description,
        string memory _researchFocus,
        uint256 _initialSupply,
        uint256 _proposalThreshold,
        uint256 _votingDuration,
        uint256 _quorumPercentage
    ) external payable returns (address) {
        require(!nameExists[_daoName], "DAO name already exists");
        require(msg.value >= feeRouter.creationFee(), "Insufficient creation fee");
        
        // Forward fee to fee router
        feeRouter.collectFee{value: msg.value}();
        
        // Create new DAO
        SimpleResearchDAO newDAO = new SimpleResearchDAO(
            _tokenName,
            _tokenSymbol,
            _daoName,
            _description,
            _researchFocus,
            _initialSupply,
            _proposalThreshold,
            _votingDuration,
            _quorumPercentage,
            msg.sender
        );
        
        address daoAddress = address(newDAO);
        deployedDAOs.push(daoAddress);
        nameExists[_daoName] = true;
        nameToDAO[_daoName] = daoAddress;
        
        emit DAOCreated(daoAddress, _daoName, msg.sender, block.timestamp);
        
        return daoAddress;
    }
    
    function isNameAvailable(string memory _name) external view returns (bool) {
        return !nameExists[_name];
    }
    
    function getDeployedDAOs() external view returns (address[] memory) {
        return deployedDAOs;
    }
    
    function creationFee() external view returns (uint256) {
        return feeRouter.creationFee();
    }
}