// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IERC20
 * @dev Minimal interface for ERC20 token interaction.
 */
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}

/**
 * @title Boomerang
 * @dev A contract for staking, registering resources, rating them, and distributing yield.
 */
contract Boomerang {
    //===========
    // State
    //===========

    address public owner;
    IERC20 public immutable stakeToken;

    // --- Staking Constants ---
    // NOTE: PYUSD has 6 decimals, so this is 10 cents.
    uint256 public constant STAKE_AMOUNT = 10 ** 5;

    // --- Reward Calculation Constants ---
    // A large number to maintain precision in yield-per-vote calculations.
    uint256 private constant PRECISION_FACTOR = 1e18;

    // --- Staking State ---
    uint256 public totalPrincipal;
    mapping(address => bool) public hasStaked;

    // --- Resource, Voting, & Reward State ---
    uint256 public totalYield;
    uint256 public totalVotes;
    uint256 public yieldPerVote;
    mapping(bytes32 => address) public resourceToContributor;
    mapping(bytes32 => uint256) public resourceVotes;
    mapping(address => uint256) public contributorVotes;
    mapping(address => mapping(bytes32 => bool)) public hasRated;
    mapping(address => uint256) public lastClaimedYieldPerVote;

    //===========
    // Events
    //===========

    event Stake(address indexed user, uint256 amount);
    event Refund(address indexed user, uint256 amount);
    event ResourceAdded(
        address indexed contributor,
        bytes32 indexed resourceHash
    );
    event RateResource(
        address indexed rater,
        bytes32 indexed resourceHash,
        address indexed contributor
    );
    event Payout(address indexed contributor, uint256 amount);
    event YieldAccrued(address indexed owner, uint256 amount);

    //===========
    // Constructor
    //===========

    constructor(address _stakeTokenAddress) {
        owner = msg.sender;
        stakeToken = IERC20(_stakeTokenAddress);
    }

    //==================
    // Staking Functions
    //==================

    function stake() external {
        require(!hasStaked[msg.sender], "Error: Already staked");
        hasStaked[msg.sender] = true;
        totalPrincipal += STAKE_AMOUNT;
        require(
            stakeToken.transferFrom(msg.sender, address(this), STAKE_AMOUNT),
            "Error: Token transfer failed"
        );
        emit Stake(msg.sender, STAKE_AMOUNT);
    }

    function refund() external {
        require(hasStaked[msg.sender], "Error: Not staked");
        hasStaked[msg.sender] = false;
        totalPrincipal -= STAKE_AMOUNT;
        require(
            stakeToken.transfer(msg.sender, STAKE_AMOUNT),
            "Error: Token transfer failed"
        );
        emit Refund(msg.sender, STAKE_AMOUNT);
    }

    //========================================
    // Resource Management & Rating Functions
    //========================================

    /**
     * @notice Registers a new resource hash to the caller's address.
     * @param resourceHash A unique hash (e.g., Keccak256) of the resource content/link.
     */
    function addResource(bytes32 resourceHash) external {
        require(hasStaked[msg.sender], "Error: Must stake to add a resource");
        require(
            resourceToContributor[resourceHash] == address(0),
            "Error: Resource hash already registered"
        );

        resourceToContributor[resourceHash] = msg.sender;
        emit ResourceAdded(msg.sender, resourceHash);
    }

    /**
     * @notice Casts a vote for a specific resource hash.
     * @param resourceHash The hash of the resource to vote for.
     */
    function rateResource(bytes32 resourceHash) external {
        require(hasStaked[msg.sender], "Error: Must stake to rate");

        address contributor = resourceToContributor[resourceHash];
        require(contributor != address(0), "Error: Resource hash not found");
        require(
            contributor != msg.sender,
            "Error: Cannot rate your own resource"
        );
        require(
            !hasRated[msg.sender][resourceHash],
            "Error: Already rated this resource"
        );

        // Update state for rating
        hasRated[msg.sender][resourceHash] = true;
        resourceVotes[resourceHash]++;
        contributorVotes[contributor]++;
        totalVotes++;

        emit RateResource(msg.sender, resourceHash, contributor);
    }

    /**
     * @notice Allows a contributor to claim their earned rewards.
     */
    function payout() external {
        uint256 userVotes = contributorVotes[msg.sender];
        require(userVotes > 0, "Error: No votes received");

        uint256 currentYieldPerVote = yieldPerVote;
        uint256 lastClaimed = lastClaimedYieldPerVote[msg.sender];

        uint256 amountToPay = (userVotes *
            (currentYieldPerVote - lastClaimed)) / PRECISION_FACTOR;
        require(amountToPay > 0, "Error: No new rewards to claim");

        lastClaimedYieldPerVote[msg.sender] = currentYieldPerVote;

        require(
            stakeToken.transfer(msg.sender, amountToPay),
            "Error: Payout transfer failed"
        );
        emit Payout(msg.sender, amountToPay);
    }

    //==================
    // Owner Functions
    //==================

    function simulateYield(uint256 yieldAmount) external {
        require(msg.sender == owner, "Error: Not owner");
        require(yieldAmount > 0, "Error: Yield must be positive");

        totalYield += yieldAmount;

        if (totalVotes > 0) {
            yieldPerVote += (yieldAmount * PRECISION_FACTOR) / totalVotes;
        }

        require(
            stakeToken.transferFrom(msg.sender, address(this), yieldAmount),
            "Error: Yield transfer failed"
        );
        emit YieldAccrued(msg.sender, yieldAmount);
    }
}
