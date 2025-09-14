# 🚀 Vercel Deployment Guide

## Quick Fix for Environment Variable Error

The error you're seeing is because the `vercel.json` was trying to reference secrets that don't exist. I've fixed this by removing the environment variable references from the config file.

## ✅ Step-by-Step Vercel Deployment

### 1. **Import Project to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository: `https://github.com/DivyanshSingh8899/BlockChainFundmainproject.git`

### 2. **Configure Build Settings**
- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3. **Add Environment Variables**
In the Vercel dashboard, go to **Settings > Environment Variables** and add these:

```
REACT_APP_SUPABASE_URL
Value: https://lckoekqbnihdrppeirrl.supabase.co

REACT_APP_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb2tla3FibmloZHJwcGVpcnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2NzQ4MDAsImV4cCI6MjA1MjI1MDgwMH0.example-anon-key

REACT_APP_CONTRACT_ADDRESS
Value: 0x5FbDB2315678afecb367f032d93F642f64180aa3

REACT_APP_BACKEND_URL
Value: https://your-backend-url.herokuapp.com

REACT_APP_NETWORK_NAME
Value: Sepolia Testnet

REACT_APP_NETWORK_RPC_URL
Value: https://sepolia.infura.io/v3/YOUR_INFURA_KEY

REACT_APP_NETWORK_CHAIN_ID
Value: 11155111

REACT_APP_NETWORK_CURRENCY_SYMBOL
Value: ETH
```

### 4. **Deploy**
Click "Deploy" and wait for the build to complete.

## 🔧 Alternative: Manual Environment Variables

If you prefer to set environment variables manually:

1. **Remove the vercel.json files** (they're optional)
2. **Set Root Directory to `frontend`** in Vercel settings
3. **Add environment variables** in the Vercel dashboard
4. **Deploy**

## 🚨 Common Issues & Solutions

### Issue: "Environment Variable references Secret which does not exist"
**Solution**: ✅ Fixed - Removed secret references from vercel.json

### Issue: Build fails
**Solution**: 
- Check Node.js version (should be 18.x)
- Clear build cache in Vercel
- Check for TypeScript errors

### Issue: 404 errors on refresh
**Solution**: ✅ Fixed - Updated routes to redirect to index.html

### Issue: Environment variables not working
**Solution**:
- Ensure variables start with `REACT_APP_`
- Restart deployment after adding variables
- Check for typos in variable names

## 📋 Deployment Checklist

- [ ] Import repository to Vercel
- [ ] Set root directory to `frontend`
- [ ] Add all environment variables
- [ ] Deploy and test
- [ ] Check console for any errors
- [ ] Test MetaMask connection (if applicable)

## 🔗 After Deployment

1. **Test the deployed URL**
2. **Check browser console** for any errors
3. **Update backend URL** in environment variables if needed
4. **Test all functionality**

Your project should now deploy successfully to Vercel!
