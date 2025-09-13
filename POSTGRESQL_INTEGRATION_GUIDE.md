# 🐘 **PostgreSQL Integration with Supabase - Complete Setup Guide**

## 🎯 **What We've Accomplished:**

✅ **PostgreSQL Client Installed**: Added `pg` and `@types/pg` packages  
✅ **Database Service Created**: `backend/services/databaseService.js`  
✅ **Backend Integration**: Updated `backend/server.js` with database endpoints  
✅ **API Endpoints Added**: Full CRUD operations for users  

## 🔧 **Setup Steps:**

### **Step 1: Get Your Supabase Database Password**

1. **Go to**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Settings → Database**
4. **Copy the database password** (it's different from your API key)

### **Step 2: Create Backend Environment File**

Create a file called `.env` in the `backend` folder with:

```bash
# Backend Environment Configuration

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Blockchain Configuration
NETWORK=hardhat
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
RPC_URL=http://localhost:8545

# Supabase Database Configuration
SUPABASE_DB_PASSWORD=your-actual-supabase-db-password-here
```

**Replace `your-actual-supabase-db-password-here` with your real database password!**

### **Step 3: Test the Connection**

You can test the PostgreSQL connection using the command you provided:

```bash
psql -h db.lckoekqbnihdrppeirrl.supabase.co -p 5432 -d postgres -U postgres
```

When prompted, enter your database password.

## 🚀 **New API Endpoints Available:**

### **1. Get All Users**
```bash
GET http://localhost:3001/api/users
```

### **2. Create User**
```bash
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "wallet_address": "0x1234..."
}
```

### **3. Get User by Email**
```bash
GET http://localhost:3001/api/users/john@example.com
```

### **4. Update User Wallet**
```bash
PUT http://localhost:3001/api/users/john@example.com/wallet
Content-Type: application/json

{
  "wallet_address": "0x5678..."
}
```

## 🗄️ **Database Schema:**

The system automatically creates a `users` table with:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `full_name` | TEXT | User's full name |
| `email` | TEXT | User's email (unique) |
| `wallet_address` | TEXT | MetaMask wallet address |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

## 🔄 **Integration with Frontend:**

The frontend can now use these endpoints instead of direct Supabase calls:

### **Example Frontend Integration:**

```javascript
// Create user via backend API
const createUser = async (userData) => {
  const response = await fetch('http://localhost:3001/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Get user by email
const getUser = async (email) => {
  const response = await fetch(`http://localhost:3001/api/users/${email}`);
  return response.json();
};

// Update wallet address
const updateWallet = async (email, walletAddress) => {
  const response = await fetch(`http://localhost:3001/api/users/${email}/wallet`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallet_address: walletAddress }),
  });
  return response.json();
};
```

## 🎯 **Benefits of This Integration:**

1. **✅ Centralized Database Management**: All database operations go through your backend
2. **✅ Better Security**: Database credentials are server-side only
3. **✅ Data Validation**: Backend validates all data before database operations
4. **✅ Error Handling**: Consistent error responses across all endpoints
5. **✅ Logging**: All database operations are logged on the server
6. **✅ Scalability**: Easy to add caching, rate limiting, etc.

## 🚀 **Next Steps:**

1. **Create the backend `.env` file** with your database password
2. **Restart the development server**: `npm run dev`
3. **Test the endpoints** using the API calls above
4. **Update your frontend** to use the new backend endpoints
5. **Verify the database connection** in the server logs

## 🔍 **Testing the Setup:**

1. **Start the server**: `npm run dev`
2. **Check the logs** for "✅ Database service initialized"
3. **Test an endpoint**: `curl http://localhost:3001/api/users`
4. **Verify in Supabase**: Check your dashboard to see the `users` table

## 🎊 **You're All Set!**

Your Blockchain Project Funding System now has:
- ✅ **Supabase Authentication** (frontend)
- ✅ **PostgreSQL Database** (backend)
- ✅ **MetaMask Integration** (wallet)
- ✅ **Smart Contract Integration** (blockchain)
- ✅ **Full API Layer** (backend endpoints)

**Your system is now a complete full-stack DApp with database integration!** 🚀
