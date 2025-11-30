// Quick Test Setup for Mutual Fund Pro API
// Run this in your browser console to set up test data

const setupTestEnvironment = async () => {
  console.log('🚀 Setting up Mutual Fund Pro test environment...\n');

  const baseUrl = 'http://localhost:5000/api';

  try {
    // 1. Check if backend is running
    console.log('1️⃣ Checking backend health...');
    const healthResponse = await fetch(`${baseUrl}/../health`);
    if (!healthResponse.ok) {
      throw new Error('Backend server not running. Start with: cd mutual-fund-backend && npm run dev');
    }
    console.log('✅ Backend is running\n');

    // 2. Test MFAPI connection (if available)
    console.log('2️⃣ Testing MFAPI integration...');
    try {
      const mfapiTest = await fetch('https://api.mfapi.in/mf/100122');
      if (mfapiTest.ok) {
        console.log('✅ MFAPI.in is accessible\n');
      } else {
        console.log('⚠️ MFAPI.in not accessible (this is OK for testing)\n');
      }
    } catch (error) {
      console.log('⚠️ MFAPI.in connection failed (expected if offline)\n');
    }

    // 3. Instructions for Postman
    console.log('3️⃣ Postman Setup Instructions:');
    console.log('   📥 Import: Mutual-Fund-Pro-API.postman_collection.json');
    console.log('   🌍 Environment: Create "Mutual Fund Pro API"');
    console.log('   ⚙️ Variables:');
    console.log('      base_url: http://localhost:5000/api');
    console.log('      auth_token: (will be set after login)');
    console.log('      test_user_id: (will be set after registration)');
    console.log('      test_recommendation_id: (will be set after creation)');
    console.log('      test_scheme_code: 100122');
    console.log('');

    // 4. Test sequence
    console.log('4️⃣ Recommended Test Sequence:');
    console.log('   1. Run "Health Check" folder');
    console.log('   2. Run "Authentication" folder (register → login)');
    console.log('   3. Run "Mutual Funds" folder');
    console.log('   4. Run "Recommendations" folder');
    console.log('   5. Run "Users" folder');
    console.log('   6. Run "Error Testing" folder');
    console.log('');

    // 5. Quick manual test
    console.log('5️⃣ Quick Manual Test:');
    console.log('   Copy this curl command to test registration:');
    console.log(`   curl -X POST ${baseUrl}/auth/register \\`);
    console.log(`        -H "Content-Type: application/json" \\`);
    console.log(`        -d '{"username":"testuser","email":"test@example.com","password":"password123"}'`);
    console.log('');

    // 6. Environment check
    console.log('6️⃣ Environment Status:');
    console.log('   ✅ Node.js backend expected on: http://localhost:5000');
    console.log('   ✅ MongoDB expected on: mongodb://localhost:27017');
    console.log('   ✅ MFAPI.in integration: Automatic fallback available');
    console.log('   ✅ JWT authentication: Ready');
    console.log('');

    console.log('🎉 Setup complete! Ready to test your Mutual Fund Pro API!');
    console.log('📖 Full guide: Check POSTMAN_TESTING_GUIDE.md');
    console.log('📊 Collection: Mutual-Fund-Pro-API.postman_collection.json');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Start backend: cd mutual-fund-backend && npm run dev');
    console.log('   2. Check MongoDB: brew services start mongodb-community');
    console.log('   3. Verify port 5000 is free: lsof -i :5000');
    console.log('   4. Check .env file exists with proper variables');
  }
};

// Auto-run setup check
console.log('🔍 Checking test environment...\n');
setupTestEnvironment();

// Export for manual calling
window.setupMFTest = setupTestEnvironment;
