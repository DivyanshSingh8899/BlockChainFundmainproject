# 🚀 BlockFund - Blockchain-Based Project Funding & Budget Tracking System

A comprehensive blockchain-based platform for project funding and budget tracking with role-based dashboards, built with React.js, TailwindCSS, and smart contract integration.

## 🌟 Features

### 🔐 Role-Based Authentication
- **Sponsor Dashboard**: Fund projects and approve milestones
- **Manager Dashboard**: Create and manage blockchain projects
- **Auditor Dashboard**: Monitor system-wide activities and transactions

### 📊 Dashboard Features
- **Real-time Analytics**: Fund distribution, project status, milestone trends
- **Interactive Charts**: Built with Recharts for data visualization
- **Transaction History**: Complete blockchain transaction tracking
- **Milestone Management**: Approve, reject, and track project milestones

### 🛠️ Technical Stack
- **Frontend**: React.js + TailwindCSS
- **Authentication**: Mock authentication system (Supabase ready)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icons
- **Notifications**: React Hot Toast
- **Routing**: React Router v6

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DivyanshSingh8899/BlockFundmain.git
   cd BlockFundmain
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Demo Access

### Quick Demo Login
Use these credentials to test different roles:

| Role | Email | Password |
|------|-------|----------|
| **Sponsor** | `sponsor@example.com` | `password123` |
| **Manager** | `manager@example.com` | `password123` |
| **Auditor** | `auditor@example.com` | `password123` |

### Demo Features
- **Click demo buttons** on login/signup pages for instant access
- **Role-based dashboards** with realistic mock data
- **Interactive components** - approve milestones, view transactions
- **Responsive design** - works on all devices

## 📱 Dashboard Overview

### 🔵 Sponsor Dashboard
- **Fund Management**: Track allocated, released, and pending funds
- **Project Oversight**: Monitor sponsored projects and their progress
- **Milestone Approval**: Approve or reject completed milestones
- **Transaction History**: View all blockchain transactions

### 🟢 Manager Dashboard
- **Project Creation**: Create new blockchain projects with milestones
- **Progress Tracking**: Monitor project milestones and completion
- **Budget Management**: Track project budgets and expenses
- **Quick Actions**: Easy access to common management tasks

### 🟡 Auditor Dashboard
- **System Monitoring**: View all projects and transactions
- **Analytics**: Comprehensive system-wide analytics and reports
- **Export Functionality**: Generate reports and data exports
- **Health Monitoring**: System status and performance metrics

## 🏗️ Project Structure

```
BlockFundmain/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── OverviewCard.js
│   │   │   ├── ProjectCard.js
│   │   │   ├── TransactionTable.js
│   │   │   ├── MilestoneTracker.js
│   │   │   └── Charts.js
│   │   ├── pages/              # Dashboard pages
│   │   │   ├── SponsorDashboard.js
│   │   │   ├── ManagerDashboard.js
│   │   │   ├── AuditorDashboard.js
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useAuthMock.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── mockData.js
│   │   │   └── demoUsers.js
│   │   └── lib/                # External library configurations
│   │       └── supabase.js
│   └── package.json
├── backend/                    # Backend services (ready for integration)
├── docs/                       # Documentation files
└── README.md
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `frontend` directory:

```env
# Supabase Configuration (Optional - uses mock data by default)
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Blockchain Configuration
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_BACKEND_URL=http://localhost:3001

# Network Configuration
REACT_APP_NETWORK_NAME=Hardhat Local
REACT_APP_NETWORK_RPC_URL=http://localhost:8545
REACT_APP_NETWORK_CHAIN_ID=31337
REACT_APP_NETWORK_CURRENCY_SYMBOL=ETH
```

## 🎨 UI Components

### Reusable Components
- **OverviewCard**: Displays key metrics with icons and trends
- **ProjectCard**: Shows project information with role-based actions
- **TransactionTable**: Complete transaction history with blockchain links
- **MilestoneTracker**: Visual milestone progress with status management
- **Charts**: Multiple chart types for data visualization

### Design Features
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Dark/Light Theme**: Consistent color scheme and typography
- **Interactive Elements**: Hover effects, loading states, animations
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔮 Future Enhancements

### Planned Features
- **MetaMask Integration**: Full wallet connection and blockchain transactions
- **Smart Contract Integration**: Deploy and interact with actual smart contracts
- **Real-time Notifications**: WebSocket-based live updates
- **Advanced Analytics**: Machine learning insights and predictions
- **Mobile App**: React Native mobile application

### Technical Improvements
- **Performance Optimization**: Code splitting, lazy loading, caching
- **Testing**: Unit tests, integration tests, E2E testing
- **CI/CD**: Automated deployment and testing pipelines
- **Documentation**: API documentation and user guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Divyansh Singh**
- GitHub: [@DivyanshSingh8899](https://github.com/DivyanshSingh8899)
- Repository: [BlockFundmain](https://github.com/DivyanshSingh8899/BlockFundmain)

## 🙏 Acknowledgments

- React.js community for excellent documentation
- TailwindCSS for the utility-first CSS framework
- Recharts for beautiful chart components
- Lucide for comprehensive icon library

---

⭐ **Star this repository if you found it helpful!**

🔗 **Live Demo**: [Coming Soon]

📧 **Contact**: For questions or support, please open an issue on GitHub.