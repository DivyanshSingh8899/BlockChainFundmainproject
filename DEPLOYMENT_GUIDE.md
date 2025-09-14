# 🚀 Deployment Guide for Fund Transparency System

## Overview
This project consists of:
- **Frontend**: React application (port 3000)
- **Backend**: Node.js API server (port 3001)
- **Smart Contracts**: Solidity contracts (Hardhat)

## 🎯 Deployment Options

### Option 1: Vercel (Frontend Only - Recommended for Demo)

**Pros**: Easy setup, great for React apps, free tier
**Cons**: Frontend only, needs separate backend hosting

#### Steps:
1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build directory to `frontend`

2. **Environment Variables** (in Vercel dashboard):
   ```
   REACT_APP_SUPABASE_URL=https://lckoekqbnihdrppeirrl.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
   REACT_APP_BACKEND_URL=https://your-backend-url.herokuapp.com
   REACT_APP_NETWORK_NAME=Sepolia Testnet
   REACT_APP_NETWORK_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   REACT_APP_NETWORK_CHAIN_ID=11155111
   REACT_APP_NETWORK_CURRENCY_SYMBOL=ETH
   ```

3. **Build Settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`

### Option 2: Netlify (Frontend Only)

**Pros**: Easy setup, good for static sites, free tier
**Cons**: Frontend only, needs separate backend hosting

#### Steps:
1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository

2. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

3. **Environment Variables** (in Netlify dashboard):
   - Same as Vercel above

### Option 3: Railway (Full Stack - Recommended for Production)

**Pros**: Full stack deployment, database support, easy scaling
**Cons**: Paid plans for production

#### Steps:
1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Import your GitHub repository

2. **Configure Services**:
   - Frontend service: Set root directory to `frontend`
   - Backend service: Set root directory to `backend`

3. **Environment Variables**:
   - Frontend: Same as above
   - Backend: Add database and blockchain configs

### Option 4: Heroku (Full Stack)

**Pros**: Full stack, good free tier, easy deployment
**Cons**: Free tier limitations

#### Steps:
1. **Create two Heroku apps**:
   - One for frontend
   - One for backend

2. **Frontend Deployment**:
   - Buildpack: `heroku/nodejs`
   - Root directory: `frontend`

3. **Backend Deployment**:
   - Buildpack: `heroku/nodejs`
   - Root directory: `backend`

## 🔧 Pre-Deployment Setup

### 1. Update Environment Variables
Create production environment files:

**Frontend (.env.production)**:
```env
REACT_APP_SUPABASE_URL=https://lckoekqbnihdrppeirrl.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-actual-supabase-key
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_BACKEND_URL=https://your-backend-url.herokuapp.com
REACT_APP_NETWORK_NAME=Sepolia Testnet
REACT_APP_NETWORK_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
REACT_APP_NETWORK_CHAIN_ID=11155111
REACT_APP_NETWORK_CURRENCY_SYMBOL=ETH
GENERATE_SOURCEMAP=false
```

**Backend (.env)**:
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
NETWORK=sepolia
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
SUPABASE_URL=https://lckoekqbnihdrppeirrl.supabase.co
SUPABASE_ANON_KEY=your-actual-supabase-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

### 2. Deploy Smart Contracts
```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia
```

### 3. Update Contract Address
Update the contract address in your environment variables after deployment.

## 🚨 Common Deployment Issues & Solutions

### Issue 1: Build Failures
**Solution**: 
- Check Node.js version (use 18.x)
- Clear node_modules and reinstall
- Check for TypeScript errors

### Issue 2: Environment Variables Not Working
**Solution**:
- Ensure variables start with `REACT_APP_` for frontend
- Check for typos in variable names
- Restart deployment after adding variables

### Issue 3: CORS Errors
**Solution**:
- Update backend CORS settings
- Add frontend URL to allowed origins

### Issue 4: MetaMask Connection Issues
**Solution**:
- Update network configuration
- Use public RPC URLs (Infura/Alchemy)
- Update contract address

## 📋 Deployment Checklist

- [ ] Update environment variables
- [ ] Deploy smart contracts to testnet
- [ ] Update contract address
- [ ] Test local build (`npm run build`)
- [ ] Configure CORS settings
- [ ] Set up domain (optional)
- [ ] Test deployed application
- [ ] Update README with live URLs

## 🔗 Recommended Deployment Flow

1. **Start with Vercel** (Frontend only)
2. **Deploy backend to Railway/Heroku**
3. **Update frontend environment variables**
4. **Test full functionality**
5. **Deploy to production domain**

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify environment variables
3. Test locally first
4. Check network connectivity
5. Verify smart contract deployment
