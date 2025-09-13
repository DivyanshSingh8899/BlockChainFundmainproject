const { Pool } = require('pg');
require('dotenv').config();

class DatabaseService {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async initialize() {
    try {
      console.log('🔄 Initializing PostgreSQL connection...');
      
      // Supabase PostgreSQL connection configuration
      this.pool = new Pool({
        host: 'db.lckoekqbnihdrppeirrl.supabase.co',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: process.env.SUPABASE_DB_PASSWORD || 'your-db-password',
        ssl: {
          rejectUnauthorized: false
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test the connection
      const client = await this.pool.connect();
      console.log('✅ Connected to Supabase PostgreSQL database');
      client.release();
      
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to PostgreSQL database:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  async query(text, params) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async createUsersTable() {
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          wallet_address TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      
      await this.query(createTableQuery);
      console.log('✅ Users table created/verified successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to create users table:', error.message);
      return false;
    }
  }

  async createUser(userData) {
    try {
      const { full_name, email, wallet_address } = userData;
      
      const insertQuery = `
        INSERT INTO users (full_name, email, wallet_address)
        VALUES ($1, $2, $3)
        RETURNING id, full_name, email, wallet_address, created_at;
      `;
      
      const result = await this.query(insertQuery, [full_name, email, wallet_address]);
      return result.rows[0];
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const selectQuery = `
        SELECT id, full_name, email, wallet_address, created_at, updated_at
        FROM users
        WHERE email = $1;
      `;
      
      const result = await this.query(selectQuery, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to get user by email:', error);
      throw error;
    }
  }

  async updateUserWallet(email, wallet_address) {
    try {
      const updateQuery = `
        UPDATE users
        SET wallet_address = $1, updated_at = NOW()
        WHERE email = $2
        RETURNING id, full_name, email, wallet_address, updated_at;
      `;
      
      const result = await this.query(updateQuery, [wallet_address, email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to update user wallet:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const selectQuery = `
        SELECT id, full_name, email, wallet_address, created_at, updated_at
        FROM users
        ORDER BY created_at DESC;
      `;
      
      const result = await this.query(selectQuery);
      return result.rows;
    } catch (error) {
      console.error('Failed to get all users:', error);
      throw error;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log('🔌 PostgreSQL connection closed');
    }
  }
}

module.exports = new DatabaseService();
