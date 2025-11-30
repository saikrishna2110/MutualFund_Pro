// MFAPI.in Integration Test Script
// Run this in your browser console to test the MFAPI integration

// Test MFAPI connection
const testMFAPI = async () => {
  console.log('🧪 Testing MFAPI.in Integration...\n');

  try {
    // Import the service (adjust path if needed)
    const { testMfApiConnection, fetchPopularFunds, fetchMutualFundByCode } = await import('./src/services/mfapiService.js');

    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const connectionTest = await testMfApiConnection();
    console.log('Connection result:', connectionTest);

    if (!connectionTest.success) {
      console.error('❌ MFAPI connection failed. Check your internet and try again.');
      return;
    }

    // Test 2: Fetch popular funds
    console.log('\n2️⃣ Testing popular funds fetch...');
    const fundsTest = await fetchPopularFunds();
    console.log('Funds fetch result:', {
      success: fundsTest.success,
      count: fundsTest.data?.length || 0,
      source: fundsTest.source,
      timestamp: fundsTest.timestamp
    });

    if (fundsTest.success && fundsTest.data.length > 0) {
      console.log('Sample fund data:', fundsTest.data[0]);
    }

    // Test 3: Fetch specific fund details
    console.log('\n3️⃣ Testing specific fund details...');
    const fundDetailsTest = await fetchMutualFundByCode('100122'); // HDFC Top 100
    console.log('Fund details result:', {
      success: fundDetailsTest.success,
      schemeName: fundDetailsTest.data?.schemeName,
      nav: fundDetailsTest.data?.nav,
      source: fundDetailsTest.source
    });

    // Summary
    console.log('\n📊 Test Summary:');
    console.log('✅ MFAPI Connection:', connectionTest.success ? 'PASS' : 'FAIL');
    console.log('✅ Funds Data:', fundsTest.success ? 'PASS' : 'FAIL');
    console.log('✅ Fund Details:', fundDetailsTest.success ? 'PASS' : 'FAIL');

    if (connectionTest.success && fundsTest.success && fundDetailsTest.success) {
      console.log('\n🎉 All tests passed! MFAPI integration is working correctly.');
      console.log('💡 Your Financial Advisor Dashboard should now show real mutual fund data!');
    } else {
      console.log('\n⚠️ Some tests failed. Check the error messages above.');
      console.log('💡 The dashboard will fall back to mock data automatically.');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    console.log('💡 Make sure you\'re running this from the correct directory and the file paths are correct.');
  }
};

// Auto-run the test
console.log('🚀 Starting MFAPI Integration Test...');
testMFAPI().then(() => {
  console.log('\n✨ Test completed. Check the results above.');
}).catch(error => {
  console.error('💥 Test execution failed:', error);
});

// Helper: Run individual tests
window.testMFAPI = {
  connection: async () => {
    const { testMfApiConnection } = await import('./src/services/mfapiService.js');
    return await testMfApiConnection();
  },
  funds: async () => {
    const { fetchPopularFunds } = await import('./src/services/mfapiService.js');
    return await fetchPopularFunds();
  },
  fundDetails: async (code = '100122') => {
    const { fetchMutualFundByCode } = await import('./src/services/mfapiService.js');
    return await fetchMutualFundByCode(code);
  }
};

console.log('\n💡 You can also run individual tests:');
console.log('- testMFAPI.connection()');
console.log('- testMFAPI.funds()');
console.log('- testMFAPI.fundDetails("100122")');
