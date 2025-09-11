# Blockchain Project Funding & Budget Tracking System

A comprehensive blockchain-based platform for transparent project funding with milestone-based releases using smart contracts. Built with Solidity, Hardhat, Node.js, Express.js, React.js, and TailwindCSS.

## 🌟 Features

- **Smart Contract-Based Funding**: Milestone-based fund releases with transparent audit trails
- **Multi-Role Support**: Project creators, sponsors, and auditors
- **Real-Time Dashboard**: Track project progress, budgets, and transactions
- **MetaMask Integration**: Seamless wallet connectivity
- **Responsive Design**: Modern UI with TailwindCSS
- **Comprehensive API**: RESTful backend with blockchain integration

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Blockchain    │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│   (Ethereum)    │
│   - Dashboard   │    │   - Express.js  │    │   - Smart       │
│   - MetaMask    │    │   - Ethers.js   │    │     Contracts   │
│   - TailwindCSS │    │   - API Routes  │    │   - Hardhat     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blockchain-project-funding
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install && cd ..
   
   # Install frontend dependencies
   cd frontend && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit .env with your configuration
   # Add your private key, RPC URLs, etc.
   ```

4. **Compile and deploy smart contracts**
   ```bash
   # Compile contracts
   npm run compile
   
   # Run tests
   npm test
   
   # Deploy to local network
   npm run deploy:local
   ```

5. **Start the development servers**
   ```bash
   # Start backend (Terminal 1)
   npm run backend
   
   # Start frontend (Terminal 2)
   npm run frontend
   
   # Or start both simultaneously
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 🎯 Demo Workflow

Run the complete demo to see the system in action:

```bash
npm run demo
```

This will:
1. Deploy the smart contract
2. Create a sample project with 6 milestones
3. Deposit funds from sponsor
4. Complete and approve first 3 milestones
5. Display transaction history and final state

## 📁 Project Structure

```
blockchain-project-funding/
├── contracts/                 # Smart contracts
│   └── ProjectFunding.sol    # Main funding contract
├── scripts/                  # Deployment and utility scripts
│   ├── deploy.js            # Contract deployment
│   └── demo.js              # Demo workflow
├── test/                    # Smart contract tests
│   └── ProjectFunding.test.js
├── backend/                 # Node.js backend
│   ├── services/           # Business logic
│   ├── routes/            # API endpoints
│   ├── utils/             # Utilities
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Utilities
│   └── public/           # Static assets
├── hardhat.config.js     # Hardhat configuration
└── package.json          # Root package.json
```

## 🔧 Smart Contract Features

### ProjectFunding Contract

- **Project Creation**: Create projects with multiple milestones
- **Fund Deposits**: Sponsors can deposit funds for projects
- **Milestone Management**: Sequential milestone completion and approval
- **Automatic Fund Release**: Funds released only upon milestone approval
- **Emergency Withdrawal**: Sponsors can withdraw unused funds
- **Audit Trail**: All transactions recorded on-chain

### Key Functions

```solidity
// Create a new project
function createProject(
    string memory _name,
    string memory _description,
    address _sponsor,
    string[] memory _milestoneDescriptions,
    uint256[] memory _milestoneAmounts,
    uint256[] memory _milestoneDueDates
) external returns (uint256)

// Deposit funds for a project
function depositFunds(uint256 _projectId) external payable

// Complete a milestone
function completeMilestone(uint256 _projectId, uint256 _milestoneIndex) external

// Approve milestone and release funds
function approveMilestone(uint256 _projectId, uint256 _milestoneIndex) external
```

## 🌐 API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `POST /api/projects/:id/deposit` - Deposit funds
- `POST /api/projects/:id/milestones/:index/complete` - Complete milestone
- `POST /api/projects/:id/milestones/:index/approve` - Approve milestone

### Statistics

- `GET /api/projects/stats/overview` - Get project statistics
- `GET /api/contract-info` - Get contract information

## 🎨 Frontend Components

### Key Pages

- **Dashboard**: Overview of projects and statistics
- **Projects**: Browse and search all projects
- **Create Project**: Form to create new projects
- **Project Details**: Detailed view of individual projects
- **Profile**: User profile and project management

### Key Components

- **Navbar**: Navigation with wallet connection
- **ProjectCard**: Project display component
- **MilestoneTracker**: Progress tracking component
- **TransactionHistory**: Blockchain transaction display

## 🔐 Security Features

- **Access Control**: Role-based permissions (creator, sponsor)
- **Input Validation**: Comprehensive data validation
- **Rate Limiting**: API rate limiting protection
- **Reentrancy Protection**: Smart contract security
- **Private Key Security**: Environment variable protection

## 🧪 Testing

### Smart Contract Tests

```bash
npm test
```

Tests cover:
- Project creation and management
- Fund deposits and withdrawals
- Milestone completion and approval
- Access control and permissions
- Edge cases and error handling

### Frontend Tests

```bash
cd frontend && npm test
```

## 🚀 Deployment

### Local Development

```bash
# Start local blockchain
npx hardhat node

# Deploy contracts
npm run deploy:local

# Start backend and frontend
npm run dev
```

### Testnet Deployment

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia
```

### Production Deployment

1. Set up production environment variables
2. Deploy smart contracts to mainnet
3. Deploy backend to cloud provider
4. Deploy frontend to CDN
5. Update DNS and SSL certificates

## 📊 Monitoring and Analytics

- **Transaction Tracking**: All blockchain transactions logged
- **Project Statistics**: Real-time project metrics
- **User Activity**: Dashboard analytics
- **Error Logging**: Comprehensive error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the demo workflow

## 🔮 Future Enhancements

- **DAO Governance**: Community-driven fund approvals
- **Chainlink Oracles**: Automated milestone verification
- **Multi-Chain Support**: Polygon, BNB Chain, Solana
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed reporting and insights
- **Integration APIs**: Third-party service integrations

## 🏆 Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- OpenZeppelin for secure smart contract libraries
- Hardhat team for development framework
- React and TailwindCSS communities
- MetaMask for wallet integration

---

**Built with ❤️ using modern blockchain technology**
