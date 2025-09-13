# Supabase Database Schema

This document outlines the database schema required for the Blockchain-Based Project Funding & Budget Tracking System.

## Tables

### 1. Users Table

```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('sponsor', 'manager', 'auditor')),
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 2. Projects Table

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  manager_id UUID REFERENCES users(id) NOT NULL,
  sponsor_id UUID REFERENCES users(id),
  total_budget DECIMAL(18,8) NOT NULL,
  total_deposited DECIMAL(18,8) DEFAULT 0,
  total_released DECIMAL(18,8) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  contract_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Managers can view their projects" ON projects
  FOR SELECT USING (auth.uid() = manager_id);

CREATE POLICY "Sponsors can view sponsored projects" ON projects
  FOR SELECT USING (auth.uid() = sponsor_id);

CREATE POLICY "Auditors can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'auditor'
    )
  );

CREATE POLICY "Managers can create projects" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() = manager_id AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'manager'
    )
  );

CREATE POLICY "Managers can update their projects" ON projects
  FOR UPDATE USING (auth.uid() = manager_id);

CREATE POLICY "Sponsors can update sponsored projects" ON projects
  FOR UPDATE USING (auth.uid() = sponsor_id);
```

### 3. Milestones Table

```sql
CREATE TABLE milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(18,8) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'approved', 'rejected')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Project participants can view milestones" ON milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = milestones.project_id 
      AND (projects.manager_id = auth.uid() OR projects.sponsor_id = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'auditor'
    )
  );

CREATE POLICY "Managers can create milestones" ON milestones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = milestones.project_id 
      AND projects.manager_id = auth.uid()
    )
  );

CREATE POLICY "Managers can update milestones" ON milestones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = milestones.project_id 
      AND projects.manager_id = auth.uid()
    )
  );

CREATE POLICY "Sponsors can approve milestones" ON milestones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = milestones.project_id 
      AND projects.sponsor_id = auth.uid()
    )
  );
```

### 4. Transactions Table

```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) NOT NULL,
  milestone_id UUID REFERENCES milestones(id),
  user_id UUID REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'release', 'refund')),
  amount DECIMAL(18,8) NOT NULL,
  transaction_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Project participants can view project transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = transactions.project_id 
      AND (projects.manager_id = auth.uid() OR projects.sponsor_id = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'auditor'
    )
  );

CREATE POLICY "Users can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Functions

### Update Timestamp Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Sample Data

### Demo Users

```sql
-- Insert demo users (these will be created through the signup process)
-- Sponsor: sponsor@example.com / password123
-- Manager: manager@example.com / password123  
-- Auditor: auditor@example.com / password123
```

### Sample Projects

```sql
INSERT INTO projects (title, description, manager_id, sponsor_id, total_budget, status) VALUES
('Blockchain E-Learning Platform', 'A comprehensive e-learning platform built on blockchain technology', 
 (SELECT id FROM users WHERE email = 'manager@example.com'),
 (SELECT id FROM users WHERE email = 'sponsor@example.com'),
 15.5, 'active'),
 
('DeFi Yield Farming Dashboard', 'A decentralized finance dashboard for yield farming optimization',
 (SELECT id FROM users WHERE email = 'manager@example.com'),
 (SELECT id FROM users WHERE email = 'sponsor@example.com'),
 25.0, 'active');
```

## Setup Instructions

1. **Create a new Supabase project** at https://supabase.com
2. **Run the SQL commands above** in the Supabase SQL Editor
3. **Update your environment variables** in the frontend `.env` file:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. **Create demo accounts** through the signup process or insert them directly
5. **Test the authentication** and role-based access

## Security Notes

- All tables have Row Level Security (RLS) enabled
- Users can only access data they're authorized to see
- Role-based access is enforced at the database level
- Sensitive operations require proper authentication
