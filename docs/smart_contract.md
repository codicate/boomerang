## 📜 **Contract Specification (Updated)**

This document outlines the detailed functionality of the `StakeAndRate` smart contract using a cumulative yield-per-vote model for fair reward distribution.

### **ERC20 Token Interface**

The contract will interact with ERC20-compliant tokens for both staking and rewards.

```solidity
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
```

---

## 🏛️ **State Variables**

These variables define the contract's state and are stored on the blockchain.

- `address public owner;`
  - The address of the contract owner, who has administrative privileges.
- `IERC20 public immutable stakeToken;`
  - The ERC20 token contract used for staking.
- `IERC20 public immutable rewardToken;`
  - The ERC20 token contract used for reward payouts.
- `uint256 public constant STAKE_AMOUNT = 10 * 10**18;`
  - The **fixed amount** of `stakeToken` required to stake (e.g., 10 tokens with 18 decimals).
- `uint256 private constant PRECISION_FACTOR = 1e18;`
  - A large multiplier to handle integer arithmetic and avoid precision loss when calculating `yieldPerVote`.
- `uint256 public totalPrincipal;`
  - The total amount of `stakeToken` currently held in the contract from all stakes.
- `mapping(address => bool) public hasStaked;`
  - Tracks if a user `address` has an active stake.
- `uint256 public totalYield;`
  - The cumulative amount of `rewardToken` ever added to the contract (kept for informational/auditing purposes).
- `uint256 public totalVotes;`
  - The total number of votes cast across all contributors.
- `mapping(address => uint256) public contributorVotes;`
  - Tracks the number of votes each contributor `address` has received.
- `mapping(address => mapping(address => bool)) public hasRated;`
  - Prevents double-voting: `rater_address => contributor_address => true/false`.
- `uint256 public yieldPerVote;`
  - **New:** A cumulative accumulator representing the total yield added, normalized by the total votes at the time of each addition, and scaled by `PRECISION_FACTOR`.
- `mapping(address => uint256) public lastClaimedYieldPerVote;`
  - **New:** A snapshot of the `yieldPerVote` value for each contributor at the time of their last payout claim.

---

## 📢 **Events**

- `event Stake(address indexed user, uint256 amount);`
- `event Refund(address indexed user, uint256 amount);`
- `event RateContributor(address indexed rater, address indexed contributor);`
- `event Payout(address indexed contributor, uint256 amount);`
- `event YieldAccrued(address indexed owner, uint256 amount);`

---

## ⚙️ **Function Logic**

### **Constructor**

- `constructor(address _stakeTokenAddress, address _rewardTokenAddress)`
  - **Purpose:** Initializes the contract's immutable state.
  - **Logic:**
    1.  Sets `owner = msg.sender`.
    2.  Sets `stakeToken = IERC20(_stakeTokenAddress)`.
    3.  Sets `rewardToken = IERC20(_rewardTokenAddress)`.

### **User Functions**

#### `stake()`

- **Purpose:** Allows a user to deposit a fixed stake to participate.
- **Logic:**
  1.  **Check:** `require(!hasStaked[msg.sender], "Error: Already staked");`
  2.  **Action:** Transfers `STAKE_AMOUNT` of `stakeToken` from the `msg.sender` to the contract.
      - `stakeToken.transferFrom(msg.sender, address(this), STAKE_AMOUNT);`
  3.  **State Update:** `hasStaked[msg.sender] = true;`, `totalPrincipal += STAKE_AMOUNT;`
  4.  **Emit Event:** `emit Stake(msg.sender, STAKE_AMOUNT);`

#### `refund()`

- **Purpose:** Allows a staked user to withdraw their entire stake.
- **Logic:**
  1.  **Check:** `require(hasStaked[msg.sender], "Error: Not staked");`
  2.  **State Update:** `hasStaked[msg.sender] = false;`, `totalPrincipal -= STAKE_AMOUNT;`
  3.  **Action:** Transfers `STAKE_AMOUNT` of `stakeToken` back to the `msg.sender`.
      - `stakeToken.transfer(msg.sender, STAKE_AMOUNT);`
  4.  **Emit Event:** `emit Refund(msg.sender, STAKE_AMOUNT);`

#### `rateContributor(address contributor)`

- **Purpose:** Allows a staked user to cast one positive vote for a contributor.
- **Logic:**
  1.  **Checks:**
      - `require(hasStaked[msg.sender], "Error: Must stake to rate");`
      - `require(msg.sender != contributor, "Error: Cannot rate yourself");`
      - `require(!hasRated[msg.sender][contributor], "Error: Already rated this contributor");`
  2.  **State Update:** `hasRated[msg.sender][contributor] = true;`, `contributorVotes[contributor]++;`, `totalVotes++;`
  3.  **Emit Event:** `emit RateContributor(msg.sender, contributor);`

#### `payout()`

- **Purpose:** Allows a contributor to claim their share of the accrued yield based on the improved fairness model.
- **Logic:**
  1.  **Check:** `require(contributorVotes[msg.sender] > 0, "Error: No votes received");`
  2.  **Calculation:**
      - `uint256 currentYieldPerVote = yieldPerVote;`
      - `uint256 lastClaimed = lastClaimedYieldPerVote[msg.sender];`
      - Calculates rewards owed since the last claim.
      - `uint256 amountToPay = (contributorVotes[msg.sender] * (currentYieldPerVote - lastClaimed)) / PRECISION_FACTOR;`
  3.  **Check:** `require(amountToPay > 0, "Error: No new rewards to claim");`
  4.  **State Update (before transfer):** Snapshots the current `yieldPerVote` for this user to mark the rewards as claimed.
      - `lastClaimedYieldPerVote[msg.sender] = currentYieldPerVote;`
  5.  **Action:** Transfers `amountToPay` of `rewardToken` to the `msg.sender`.
      - `rewardToken.transfer(msg.sender, amountToPay);`
  6.  **Emit Event:** `emit Payout(msg.sender, amountToPay);`

### **Owner/Admin Function**

#### `simulateYield(uint256 yieldAmount)`

- **Purpose:** Allows the owner to add funds to the reward pool and updates the system's `yieldPerVote`.
- **Logic:**
  1.  **Checks:**
      - `require(msg.sender == owner, "Error: Not owner");`
      - `require(yieldAmount > 0, "Error: Yield must be positive");`
  2.  **Action:** Transfers `yieldAmount` of `rewardToken` from the `msg.sender` to the contract.
      - `rewardToken.transferFrom(msg.sender, address(this), yieldAmount);`
  3.  **State Update:**
      - `totalYield += yieldAmount;`
      - **If `totalVotes` is greater than 0**, update `yieldPerVote`. This prevents division by zero and ensures yield is only distributed if there are votes.
      - `if (totalVotes > 0) { yieldPerVote += (yieldAmount * PRECISION_FACTOR) / totalVotes; }`
  4.  **Emit Event:** `emit YieldAccrued(msg.sender, yieldAmount);`
