// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ProjectFunding
 * @dev Smart contract for milestone-based project funding with transparent budget tracking
 */
contract ProjectFunding is Ownable, ReentrancyGuard {
    
    struct Milestone {
        string description;
        uint256 amount;
        bool completed;
        bool approved;
        bool paid;
        uint256 dueDate;
    }
    
    struct Project {
        uint256 id;
        string name;
        string description;
        address creator;
        address sponsor;
        uint256 totalBudget;
        uint256 totalDeposited;
        uint256 totalReleased;
        uint256 currentMilestone;
        bool active;
        uint256 createdAt;
        Milestone[] milestones;
    }
    
    // State variables
    uint256 private nextProjectId = 1;
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public userProjects;
    mapping(address => uint256[]) public sponsoredProjects;
    
    // Events
    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        address indexed creator,
        address indexed sponsor,
        uint256 totalBudget
    );
    
    event FundsDeposited(
        uint256 indexed projectId,
        address indexed sponsor,
        uint256 amount,
        uint256 totalDeposited
    );
    
    event MilestoneCompleted(
        uint256 indexed projectId,
        uint256 milestoneIndex,
        string description
    );
    
    event MilestoneApproved(
        uint256 indexed projectId,
        uint256 milestoneIndex,
        uint256 amountReleased
    );
    
    event FundsReleased(
        uint256 indexed projectId,
        address indexed recipient,
        uint256 amount,
        uint256 milestoneIndex
    );
    
    event ProjectCompleted(uint256 indexed projectId);
    
    // Modifiers
    modifier onlyProjectCreator(uint256 _projectId) {
        require(projects[_projectId].creator == msg.sender, "Only project creator can call this");
        _;
    }
    
    modifier onlyProjectSponsor(uint256 _projectId) {
        require(projects[_projectId].sponsor == msg.sender, "Only project sponsor can call this");
        _;
    }
    
    modifier projectExists(uint256 _projectId) {
        require(_projectId > 0 && _projectId < nextProjectId, "Project does not exist");
        _;
    }
    
    modifier projectActive(uint256 _projectId) {
        require(projects[_projectId].active, "Project is not active");
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Creates a new project with milestones
     * @param _name Project name
     * @param _description Project description
     * @param _sponsor Address of the project sponsor
     * @param _milestoneDescriptions Array of milestone descriptions
     * @param _milestoneAmounts Array of milestone funding amounts
     * @param _milestoneDueDates Array of milestone due dates
     */
    function createProject(
        string memory _name,
        string memory _description,
        address _sponsor,
        string[] memory _milestoneDescriptions,
        uint256[] memory _milestoneAmounts,
        uint256[] memory _milestoneDueDates
    ) external returns (uint256) {
        require(_sponsor != address(0), "Invalid sponsor address");
        require(_milestoneDescriptions.length == _milestoneAmounts.length, "Milestone arrays length mismatch");
        require(_milestoneAmounts.length == _milestoneDueDates.length, "Milestone arrays length mismatch");
        require(_milestoneDescriptions.length > 0, "At least one milestone required");
        
        uint256 totalBudget = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Milestone amount must be greater than 0");
            require(_milestoneDueDates[i] > block.timestamp, "Due date must be in the future");
            totalBudget += _milestoneAmounts[i];
        }
        
        uint256 projectId = nextProjectId++;
        
        Project storage newProject = projects[projectId];
        newProject.id = projectId;
        newProject.name = _name;
        newProject.description = _description;
        newProject.creator = msg.sender;
        newProject.sponsor = _sponsor;
        newProject.totalBudget = totalBudget;
        newProject.active = true;
        newProject.createdAt = block.timestamp;
        
        // Add milestones
        for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
            newProject.milestones.push(Milestone({
                description: _milestoneDescriptions[i],
                amount: _milestoneAmounts[i],
                completed: false,
                approved: false,
                paid: false,
                dueDate: _milestoneDueDates[i]
            }));
        }
        
        // Update mappings
        userProjects[msg.sender].push(projectId);
        sponsoredProjects[_sponsor].push(projectId);
        
        emit ProjectCreated(projectId, _name, msg.sender, _sponsor, totalBudget);
        
        return projectId;
    }
    
    /**
     * @dev Allows sponsor to deposit funds for a project
     * @param _projectId The ID of the project to fund
     */
    function depositFunds(uint256 _projectId) 
        external 
        payable 
        projectExists(_projectId) 
        projectActive(_projectId)
        onlyProjectSponsor(_projectId) 
    {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        Project storage project = projects[_projectId];
        require(project.totalDeposited + msg.value <= project.totalBudget, "Cannot deposit more than total budget");
        
        project.totalDeposited += msg.value;
        
        emit FundsDeposited(_projectId, msg.sender, msg.value, project.totalDeposited);
    }
    
    /**
     * @dev Marks a milestone as completed by the project creator
     * @param _projectId The ID of the project
     * @param _milestoneIndex The index of the milestone to mark as completed
     */
    function completeMilestone(uint256 _projectId, uint256 _milestoneIndex) 
        external 
        projectExists(_projectId) 
        projectActive(_projectId)
        onlyProjectCreator(_projectId) 
    {
        Project storage project = projects[_projectId];
        require(_milestoneIndex < project.milestones.length, "Invalid milestone index");
        require(!project.milestones[_milestoneIndex].completed, "Milestone already completed");
        require(_milestoneIndex == project.currentMilestone, "Must complete milestones in order");
        
        project.milestones[_milestoneIndex].completed = true;
        
        emit MilestoneCompleted(_projectId, _milestoneIndex, project.milestones[_milestoneIndex].description);
    }
    
    /**
     * @dev Approves a completed milestone and releases funds
     * @param _projectId The ID of the project
     * @param _milestoneIndex The index of the milestone to approve
     */
    function approveMilestone(uint256 _projectId, uint256 _milestoneIndex) 
        external 
        projectExists(_projectId) 
        projectActive(_projectId)
        onlyProjectSponsor(_projectId)
        nonReentrant
    {
        Project storage project = projects[_projectId];
        require(_milestoneIndex < project.milestones.length, "Invalid milestone index");
        require(project.milestones[_milestoneIndex].completed, "Milestone not completed yet");
        require(!project.milestones[_milestoneIndex].approved, "Milestone already approved");
        require(!project.milestones[_milestoneIndex].paid, "Milestone already paid");
        
        Milestone storage milestone = project.milestones[_milestoneIndex];
        require(project.totalDeposited >= milestone.amount, "Insufficient funds deposited");
        
        milestone.approved = true;
        milestone.paid = true;
        project.totalReleased += milestone.amount;
        project.currentMilestone++;
        
        // Transfer funds to project creator
        payable(project.creator).transfer(milestone.amount);
        
        emit MilestoneApproved(_projectId, _milestoneIndex, milestone.amount);
        emit FundsReleased(_projectId, project.creator, milestone.amount, _milestoneIndex);
        
        // Check if project is completed
        if (project.currentMilestone >= project.milestones.length) {
            project.active = false;
            emit ProjectCompleted(_projectId);
        }
    }
    
    /**
     * @dev Emergency withdrawal function for sponsors (only unused funds)
     * @param _projectId The ID of the project
     */
    function emergencyWithdraw(uint256 _projectId) 
        external 
        projectExists(_projectId)
        onlyProjectSponsor(_projectId)
        nonReentrant
    {
        Project storage project = projects[_projectId];
        uint256 withdrawableAmount = project.totalDeposited - project.totalReleased;
        require(withdrawableAmount > 0, "No funds available for withdrawal");
        
        project.totalDeposited = project.totalReleased;
        project.active = false;
        
        payable(msg.sender).transfer(withdrawableAmount);
    }
    
    // View functions
    
    /**
     * @dev Get project details
     * @param _projectId The ID of the project
     */
    function getProject(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (
            uint256 id,
            string memory name,
            string memory description,
            address creator,
            address sponsor,
            uint256 totalBudget,
            uint256 totalDeposited,
            uint256 totalReleased,
            uint256 currentMilestone,
            bool active,
            uint256 createdAt
        ) 
    {
        Project storage project = projects[_projectId];
        return (
            project.id,
            project.name,
            project.description,
            project.creator,
            project.sponsor,
            project.totalBudget,
            project.totalDeposited,
            project.totalReleased,
            project.currentMilestone,
            project.active,
            project.createdAt
        );
    }
    
    /**
     * @dev Get project milestones
     * @param _projectId The ID of the project
     */
    function getProjectMilestones(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (Milestone[] memory) 
    {
        return projects[_projectId].milestones;
    }
    
    /**
     * @dev Get milestone details
     * @param _projectId The ID of the project
     * @param _milestoneIndex The index of the milestone
     */
    function getMilestone(uint256 _projectId, uint256 _milestoneIndex) 
        external 
        view 
        projectExists(_projectId) 
        returns (
            string memory description,
            uint256 amount,
            bool completed,
            bool approved,
            bool paid,
            uint256 dueDate
        ) 
    {
        require(_milestoneIndex < projects[_projectId].milestones.length, "Invalid milestone index");
        Milestone storage milestone = projects[_projectId].milestones[_milestoneIndex];
        return (
            milestone.description,
            milestone.amount,
            milestone.completed,
            milestone.approved,
            milestone.paid,
            milestone.dueDate
        );
    }
    
    /**
     * @dev Get projects created by a user
     * @param _user The address of the user
     */
    function getUserProjects(address _user) external view returns (uint256[] memory) {
        return userProjects[_user];
    }
    
    /**
     * @dev Get projects sponsored by a user
     * @param _sponsor The address of the sponsor
     */
    function getSponsoredProjects(address _sponsor) external view returns (uint256[] memory) {
        return sponsoredProjects[_sponsor];
    }
    
    /**
     * @dev Get total number of projects
     */
    function getTotalProjects() external view returns (uint256) {
        return nextProjectId - 1;
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
