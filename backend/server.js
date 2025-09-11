const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const projectRoutes = require('./routes/projects');
const blockchainService = require('./services/blockchainService');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Blockchain Project Funding API is running',
    timestamp: new Date().toISOString(),
    network: process.env.NETWORK || 'hardhat',
    contractAddress: process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  });
});

// API routes
app.use('/api/projects', projectRoutes);

// Contract info endpoint
app.get('/api/contract-info', async (req, res) => {
  try {
    const contractInfo = await blockchainService.getContractInfo();
    res.json(contractInfo);
  } catch (error) {
    console.error('Error fetching contract info:', error);
    // Return mock data when blockchain connection fails
    res.json({
      contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      network: {
        name: 'hardhat',
        chainId: '31337'
      },
      totalProjects: '2',
      contractBalance: '40.5',
      isConnected: false
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === 'CALL_EXCEPTION') {
    return res.status(400).json({
      error: 'Smart contract call failed',
      message: err.reason || err.message,
      type: 'BLOCKCHAIN_ERROR'
    });
  }
  
  if (err.code === 'INSUFFICIENT_FUNDS') {
    return res.status(400).json({
      error: 'Insufficient funds for transaction',
      message: err.message,
      type: 'INSUFFICIENT_FUNDS'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Initialize blockchain service and start server
async function startServer() {
  try {
    console.log('🚀 Starting Blockchain Project Funding API...');
    
    // Initialize blockchain connection (optional)
    try {
      await blockchainService.initialize();
      console.log('✅ Blockchain service initialized');
    } catch (error) {
      console.log('⚠️ Blockchain service not available, using mock data');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🌟 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 API base URL: http://localhost:${PORT}/api`);
      console.log(`🔗 Contract Address: ${process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}`);
      console.log(`🌐 Network: ${process.env.NETWORK || 'hardhat'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
