// Demo users for testing different roles
export const demoUsers = {
  sponsor: {
    email: 'sponsor@example.com',
    password: 'password123',
    full_name: 'John Sponsor',
    role: 'sponsor',
    wallet_address: '0x1234567890123456789012345678901234567890'
  },
  manager: {
    email: 'manager@example.com',
    password: 'password123',
    full_name: 'Jane Manager',
    role: 'manager',
    wallet_address: '0x2345678901234567890123456789012345678901'
  },
  auditor: {
    email: 'auditor@example.com',
    password: 'password123',
    full_name: 'Bob Auditor',
    role: 'auditor',
    wallet_address: '0x3456789012345678901234567890123456789012'
  }
}

// Auto-fill demo user data
export const fillDemoUser = (role) => {
  const user = demoUsers[role]
  if (user) {
    // Fill form fields if they exist
    const emailField = document.querySelector('input[name="email"]')
    const passwordField = document.querySelector('input[name="password"]')
    const fullNameField = document.querySelector('input[name="full_name"]')
    const roleField = document.querySelector('select[name="role"]')
    const walletField = document.querySelector('input[name="wallet_address"]')
    
    if (emailField) emailField.value = user.email
    if (passwordField) passwordField.value = user.password
    if (fullNameField) fullNameField.value = user.full_name
    if (roleField) roleField.value = user.role
    if (walletField) walletField.value = user.wallet_address
    
    return user
  }
  return null
}
