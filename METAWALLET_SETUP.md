# 🔗 Complete MetaMask Wallet Setup Guide

## 🎯 **Quick Setup (5 Minutes)**

### **Step 1: Install MetaMask**
1. Go to: https://metamask.io/
2. Click "Download" → Select your browser
3. Install the extension
4. Create a new wallet or import existing

### **Step 2: Add Local Network**
1. Open MetaMask extension
2. Click network dropdown (top) → "Add Network" → "Add Network Manually"
3. Enter these details:
   ```
   Network Name: Localhost 8545
   RPC URL: http://localhost:8545
   Chain ID: 1337
   Currency Symbol: ETH
   ```
4. Click "Save"

### **Step 3: Import Test Accounts**
Copy these private keys to import funded test accounts:

**Creator Account:**
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
- Balance: 10,000 ETH

**Sponsor Account:**
- Address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- Private Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
- Balance: 10,000 ETH

**How to Import:**
1. MetaMask → Account icon → "Import Account"
2. Select "Private Key"
3. Paste private key → Click "Import"
4. Rename account (e.g., "Creator", "Sponsor")

### **Step 4: Connect to Your App**
1. Go to: http://localhost:3000
2. Click "Connect Wallet" button
3. Select account in MetaMask
4. Approve connection
5. Switch to "Localhost 8545" network if prompted

## 🚀 **Test Your Working Model**

### **Test 1: Create Project (as Creator)**
1. Switch to Creator account in MetaMask
2. Go to "Create Project" in app
3. Fill details:
   - Name: "My Test Project"
   - Description: "Testing blockchain funding"
   - Sponsor: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
   - Add 3 milestones with amounts (0.5, 1.0, 1.5 ETH)
4. Click "Create Project"
5. Confirm transaction in MetaMask

### **Test 2: Fund Project (as Sponsor)**
1. Switch to Sponsor account in MetaMask
2. Go to your created project
3. Click "Deposit Funds"
4. Enter amount: 3.0 ETH
5. Confirm transaction in MetaMask

### **Test 3: Complete Milestones**
1. Switch back to Creator account
2. Go to project details
3. Click "Mark Complete" for first milestone
4. Confirm transaction in MetaMask

### **Test 4: Approve & Release Funds**
1. Switch to Sponsor account
2. Go to project details
3. Click "Approve & Release" for completed milestone
4. Confirm transaction in MetaMask
5. Watch funds get released to creator!

## 🔧 **Troubleshooting**

### **If MetaMask Won't Connect:**
- Make sure you're on "Localhost 8545" network
- Refresh the page
- Check browser console for errors
- Try disconnecting and reconnecting

### **If Transactions Fail:**
- Ensure blockchain node is running (`npm run node`)
- Check you have enough ETH (you should have 10,000 ETH)
- Verify network settings

### **If App Shows Errors:**
- Check that backend is running (http://localhost:3001/health)
- Verify contract is deployed
- Check browser console for errors

## 📱 **Mobile Testing (Optional)**

For mobile MetaMask:
1. Download MetaMask mobile app
2. Add custom network:
   - RPC URL: `http://YOUR_COMPUTER_IP:8545`
   - Chain ID: 1337
3. Import same private keys

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ MetaMask connects successfully
- ✅ You can see your ETH balance
- ✅ You can create projects
- ✅ You can deposit funds
- ✅ You can complete milestones
- ✅ You can approve and release funds
- ✅ All transactions appear on blockchain

## 🚀 **Your Model is Now Working!**

Once connected, you have a fully functional blockchain project funding system with:
- Smart contract-based funding
- Milestone-based releases
- Transparent transactions
- Real-time updates
- Multi-role support (Creator/Sponsor)

**Happy Testing! 🎯**
