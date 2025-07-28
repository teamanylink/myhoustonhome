import fetch from 'node-fetch';

const DEPLOYED_URL = 'https://www.myhoustonhome.org';

async function testDeployedAdmin() {
  console.log('🧪 Testing deployed admin login...\n');
  
  try {
    // Test 1: Try to login with default credentials
    console.log('📡 Testing default admin login...');
    const loginResponse = await fetch(`${DEPLOYED_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'denis@denvagroup.com',
        password: 'TempPassword123!'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('🔑 Token received:', loginData.token ? 'Yes' : 'No');
      console.log('👤 Admin data:', loginData.admin);
      console.log('\n🎉 Admin login is working on deployed site!');
    } else {
      console.log('❌ Login failed:', loginData.error);
      console.log('📊 Status:', loginResponse.status);
    }
    
  } catch (error) {
    console.error('💥 Error testing deployed admin:', error.message);
  }
}

// Run the test
testDeployedAdmin(); 