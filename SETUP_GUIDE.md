# 🚀 Quick Setup Guide

## ✅ Current Status
Your Blockchain Project Funding System is **FULLY OPERATIONAL**! 

### 🎯 What's Running:
- ✅ **Backend API**: http://localhost:3001 (Running)
- ✅ **Frontend App**: http://localhost:3000 (Running) 
- ✅ **Blockchain Node**: http://localhost:8545 (Running)
- ✅ **Smart Contract**: Deployed and tested

## 🌐 Access Your Application

### 1. **Frontend Dashboard**
Open your browser and go to: **http://localhost:3000**

### 2. **Backend API**
API is running at: **http://localhost:3001**
- Health Check: http://localhost:3001/health
- API Docs: http://localhost:3001/api

## 🔗 Connect MetaMask

### Step 1: Add Local Network
1. Open MetaMask
2. Click on network dropdown (top of MetaMask)
3. Click "Add Network" → "Add Network Manually"
4. Fill in:
   - **Network Name**: Localhost 8545
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

### Step 2: Import Demo Accounts
Use these test accounts from the running blockchain node:

**Creator Account:**
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Sponsor Account:**
- Address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- Private Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`

### Step 3: Import Account
1. In MetaMask, click account icon (top right)
2. Click "Import Account"
3. Paste the private key
4. Click "Import"

## 🎮 Demo Workflow

### What Just Happened:
1. ✅ **Smart Contract Deployed**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
2. ✅ **Project Created**: "Blockchain E-Learning Platform" (ID: 1)
3. ✅ **Funds Deposited**: 5.0 ETH by sponsor
4. ✅ **Milestones Completed**: 3 out of 6 milestones
5. ✅ **Funds Released**: 3.0 ETH to creator

### Try It Yourself:
1. **Connect MetaMask** with one of the demo accounts
2. **Go to Frontend**: http://localhost:3000
3. **Create New Project**: Click "Create Project"
4. **Deposit Funds**: As sponsor, fund the project
5. **Complete Milestones**: As creator, mark milestones complete
6. **Approve & Release**: As sponsor, approve and release funds

## 📊 Current Project Status

**Project ID**: 1  
**Name**: Blockchain E-Learning Platform  
**Total Budget**: 5.0 ETH  
**Deposited**: 5.0 ETH  
**Released**: 3.0 ETH  
**Remaining**: 2.0 ETH  
**Progress**: 3/6 milestones completed  

## 🔧 Available Commands

```bash
# Start everything
npm run dev

# Run demo
npm run demo

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to local
npm run deploy:local
```

## 🎯 Next Steps

1. **Explore the Frontend**: Navigate through all pages
2. **Create Projects**: Try creating your own projects
3. **Test Workflows**: Complete the full milestone cycle
4. **Customize**: Modify the smart contract or frontend
5. **Deploy**: Deploy to testnet when ready

## 🆘 Troubleshooting

### If Frontend Shows Errors:
- Check MetaMask is connected to localhost:8545
- Make sure you're using the correct network (Chain ID: 1337)
- Refresh the page

### If Backend Shows Errors:
- Check if blockchain node is running
- Verify contract address in environment

### If MetaMask Connection Fails:
- Make sure you're on the correct network
- Try refreshing the page
- Check browser console for errors

## 🎉 Congratulations!

You now have a fully functional blockchain-based project funding system running locally! The system demonstrates:

- ✅ **Smart Contract Security**: Milestone-based fund releases
- ✅ **Transparent Transactions**: All on blockchain
- ✅ **Multi-Role Support**: Creators, sponsors, auditors
- ✅ **Real-time Updates**: Live project tracking
- ✅ **Modern UI**: Beautiful, responsive design

**Happy Building! 🚀**
