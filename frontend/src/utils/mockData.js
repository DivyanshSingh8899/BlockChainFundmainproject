// Mock data for dashboards
export const mockProjects = [
  {
    id: '1',
    title: 'DeFi Lending Platform',
    description: 'A decentralized lending platform for cryptocurrency assets',
    manager_id: 'manager-1',
    sponsor_id: 'sponsor-1',
    total_budget: 50.0,
    total_deposited: 50.0,
    total_released: 25.0,
    status: 'active',
    contract_address: '0x1234567890123456789012345678901234567890',
    created_at: '2024-01-15T10:00:00Z',
    manager: {
      id: 'manager-1',
      full_name: 'Jane Manager',
      email: 'manager@example.com',
      wallet_address: '0x2345678901234567890123456789012345678901'
    },
    sponsor: {
      id: 'sponsor-1',
      full_name: 'John Sponsor',
      email: 'sponsor@example.com',
      wallet_address: '0x1234567890123456789012345678901234567890'
    },
    milestones: [
      {
        id: '1',
        project_id: '1',
        title: 'Smart Contract Development',
        description: 'Develop and deploy core smart contracts',
        amount: 15.0,
        status: 'completed',
        due_date: '2024-02-15T00:00:00Z',
        completed_at: '2024-02-10T00:00:00Z',
        approved_at: '2024-02-12T00:00:00Z'
      },
      {
        id: '2',
        project_id: '1',
        title: 'Frontend Development',
        description: 'Build user interface and connect to smart contracts',
        amount: 20.0,
        status: 'completed',
        due_date: '2024-03-15T00:00:00Z',
        completed_at: '2024-03-12T00:00:00Z',
        approved_at: '2024-03-14T00:00:00Z'
      },
      {
        id: '3',
        project_id: '1',
        title: 'Testing & Security Audit',
        description: 'Comprehensive testing and security audit',
        amount: 10.0,
        status: 'in_progress',
        due_date: '2024-04-15T00:00:00Z'
      },
      {
        id: '4',
        project_id: '1',
        title: 'Launch & Marketing',
        description: 'Platform launch and marketing campaign',
        amount: 5.0,
        status: 'pending',
        due_date: '2024-05-15T00:00:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'NFT Marketplace',
    description: 'A decentralized marketplace for buying and selling NFTs',
    manager_id: 'manager-2',
    sponsor_id: 'sponsor-1',
    total_budget: 30.0,
    total_deposited: 30.0,
    total_released: 10.0,
    status: 'active',
    contract_address: '0x3456789012345678901234567890123456789012',
    created_at: '2024-02-01T10:00:00Z',
    manager: {
      id: 'manager-2',
      full_name: 'Bob Developer',
      email: 'bob@example.com',
      wallet_address: '0x3456789012345678901234567890123456789012'
    },
    sponsor: {
      id: 'sponsor-1',
      full_name: 'John Sponsor',
      email: 'sponsor@example.com',
      wallet_address: '0x1234567890123456789012345678901234567890'
    },
    milestones: [
      {
        id: '5',
        project_id: '2',
        title: 'Smart Contract Development',
        description: 'Develop NFT marketplace smart contracts',
        amount: 12.0,
        status: 'completed',
        due_date: '2024-03-01T00:00:00Z',
        completed_at: '2024-02-28T00:00:00Z',
        approved_at: '2024-03-02T00:00:00Z'
      },
      {
        id: '6',
        project_id: '2',
        title: 'Frontend Development',
        description: 'Build marketplace interface',
        amount: 15.0,
        status: 'in_progress',
        due_date: '2024-04-01T00:00:00Z'
      },
      {
        id: '7',
        project_id: '2',
        title: 'Testing & Launch',
        description: 'Testing and platform launch',
        amount: 3.0,
        status: 'pending',
        due_date: '2024-05-01T00:00:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'DAO Governance Platform',
    description: 'A platform for decentralized autonomous organization governance',
    manager_id: 'manager-1',
    sponsor_id: 'sponsor-2',
    total_budget: 40.0,
    total_deposited: 40.0,
    total_released: 0.0,
    status: 'pending',
    contract_address: '0x4567890123456789012345678901234567890123',
    created_at: '2024-03-01T10:00:00Z',
    manager: {
      id: 'manager-1',
      full_name: 'Jane Manager',
      email: 'manager@example.com',
      wallet_address: '0x2345678901234567890123456789012345678901'
    },
    sponsor: {
      id: 'sponsor-2',
      full_name: 'Alice Investor',
      email: 'alice@example.com',
      wallet_address: '0x4567890123456789012345678901234567890123'
    },
    milestones: [
      {
        id: '8',
        project_id: '3',
        title: 'Smart Contract Development',
        description: 'Develop DAO governance smart contracts',
        amount: 20.0,
        status: 'pending',
        due_date: '2024-04-01T00:00:00Z'
      },
      {
        id: '9',
        project_id: '3',
        title: 'Frontend Development',
        description: 'Build governance interface',
        amount: 15.0,
        status: 'pending',
        due_date: '2024-05-01T00:00:00Z'
      },
      {
        id: '10',
        project_id: '3',
        title: 'Testing & Launch',
        description: 'Testing and platform launch',
        amount: 5.0,
        status: 'pending',
        due_date: '2024-06-01T00:00:00Z'
      }
    ]
  }
]

export const mockTransactions = [
  {
    id: '1',
    project_id: '1',
    user_id: 'sponsor-1',
    type: 'deposit',
    amount: 50.0,
    status: 'confirmed',
    transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    created_at: '2024-01-15T10:00:00Z',
    project: {
      id: '1',
      title: 'DeFi Lending Platform'
    }
  },
  {
    id: '2',
    project_id: '1',
    user_id: 'sponsor-1',
    type: 'release',
    amount: 15.0,
    status: 'confirmed',
    transaction_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    created_at: '2024-02-12T10:00:00Z',
    project: {
      id: '1',
      title: 'DeFi Lending Platform'
    }
  },
  {
    id: '3',
    project_id: '1',
    user_id: 'sponsor-1',
    type: 'release',
    amount: 20.0,
    status: 'confirmed',
    transaction_hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    created_at: '2024-03-14T10:00:00Z',
    project: {
      id: '1',
      title: 'DeFi Lending Platform'
    }
  },
  {
    id: '4',
    project_id: '2',
    user_id: 'sponsor-1',
    type: 'deposit',
    amount: 30.0,
    status: 'confirmed',
    transaction_hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    created_at: '2024-02-01T10:00:00Z',
    project: {
      id: '2',
      title: 'NFT Marketplace'
    }
  },
  {
    id: '5',
    project_id: '2',
    user_id: 'sponsor-1',
    type: 'release',
    amount: 12.0,
    status: 'confirmed',
    transaction_hash: '0x90abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    created_at: '2024-03-02T10:00:00Z',
    project: {
      id: '2',
      title: 'NFT Marketplace'
    }
  }
]

// Mock database helpers
export const mockDbHelpers = {
  getProjects: async (filters = {}) => {
    console.log('Mock getProjects called with filters:', filters)
    
    let filteredProjects = [...mockProjects]
    
    if (filters.sponsor_id) {
      filteredProjects = filteredProjects.filter(p => p.sponsor_id === filters.sponsor_id)
    }
    
    if (filters.manager_id) {
      filteredProjects = filteredProjects.filter(p => p.manager_id === filters.manager_id)
    }
    
    return { data: filteredProjects, error: null }
  },
  
  getTransactions: async (filters = {}) => {
    console.log('Mock getTransactions called with filters:', filters)
    
    let filteredTransactions = [...mockTransactions]
    
    if (filters.user_id) {
      filteredTransactions = filteredTransactions.filter(t => t.user_id === filters.user_id)
    }
    
    return { data: filteredTransactions, error: null }
  },
  
  updateMilestone: async (milestoneId, updates) => {
    console.log('Mock updateMilestone called:', milestoneId, updates)
    return { data: { id: milestoneId, ...updates }, error: null }
  }
}
