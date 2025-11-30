# 🚀 Postman Testing Guide for Mutual Fund Pro API

## 📋 Overview
This guide explains how to use the comprehensive Postman collection to test your Mutual Fund Pro backend API. The collection includes automated tests, environment variables, and complete API coverage.

---

## 📦 **What You Get:**

### **Complete Test Collection:**
- ✅ **40+ API endpoints** tested
- ✅ **Automated test scripts** for each request
- ✅ **Environment variables** for easy configuration
- ✅ **Authentication flow** testing
- ✅ **Error handling** verification
- ✅ **Performance testing** (response times)
- ✅ **Rate limiting** tests

### **Test Categories:**
1. **Health Checks** - API availability
2. **Authentication** - Login, register, profile
3. **Mutual Funds** - CRUD operations, search, sync
4. **Recommendations** - Create, read, update, delete
5. **Users** - Profile management, password changes
6. **Error Testing** - Invalid auth, 404s, rate limits

---

## 🛠️ **Setup Instructions:**

### **Step 1: Install Postman**
```bash
# Download from: https://www.postman.com/downloads/
# Or use web version at: https://web.postman.co/
```

### **Step 2: Import Collection**
1. **Open Postman**
2. **Click "Import"** (top left)
3. **Select "File"** tab
4. **Choose:** `Mutual-Fund-Pro-API.postman_collection.json`
5. **Click "Import"**

### **Step 3: Configure Environment**
1. **Click "Environments"** (left sidebar)
2. **Click "Create Environment"**
3. **Name it:** `Mutual Fund Pro API`
4. **Add variables:**

```json
{
  "base_url": "http://localhost:5000/api",
  "auth_token": "",
  "test_user_id": "",
  "test_recommendation_id": "",
  "test_scheme_code": "100122"
}
```

### **Step 4: Start Your Backend**
```bash
# Make sure your backend is running
cd mutual-fund-backend
npm run dev
# Should be running on http://localhost:5000
```

---

## 🧪 **Running Tests:**

### **Method 1: Run Entire Collection**
1. **Select collection:** "Mutual Fund Pro API"
2. **Click "Run Collection"** (Runner button)
3. **Select environment:** "Mutual Fund Pro API"
4. **Click "Run Mutual Fund..."**

### **Method 2: Run Individual Folders**
1. **Expand collection**
2. **Right-click folder** (e.g., "Authentication")
3. **Select "Run folder"**

### **Method 3: Run Individual Requests**
1. **Click on any request**
2. **Click "Send"** to test manually
3. **Check "Tests" tab** for automated verification

---

## 📊 **Test Flow & Dependencies:**

### **Complete Test Sequence:**
```
1. Health Check → 2. Register → 3. Login → 4. Get Profile
                    ↓
5. Search Funds → 6. Get Top Funds → 7. Get All Funds → 8. Get Fund Details
                    ↓
9. Create Recommendation → 10. Get Advisor Recs → 11. Get Investor Recs
                    ↓
12. Update Rec Status → 13. Delete Recommendation
                    ↓
14. Update Profile → 15. Change Password
                    ↓
16. Error Tests (Invalid Auth, 404, Rate Limits)
```

### **Key Dependencies:**
- **Login required** before authenticated endpoints
- **Recommendation creation** before status updates
- **User registration** before profile operations

---

## 🎯 **Detailed Test Descriptions:**

### **1. Health Check**
```
GET /api/health
```
- **Purpose:** Verify API server is running
- **Expected:** Status 200 with uptime info
- **No auth required**

### **2. Authentication Tests**
```javascript
// Register new user
POST /api/auth/register
{
  "username": "testuser_{{timestamp}}",
  "email": "testuser_{{timestamp}}@example.com",
  "password": "password123"
}

// Login and get token
POST /api/auth/login
{
  "email": "testuser_{{timestamp}}@example.com",
  "password": "password123"
}

// Get user profile
GET /api/auth/profile
// Requires: Authorization: Bearer {{auth_token}}
```

### **3. Mutual Fund Tests**
```javascript
// Public endpoints (no auth)
GET /api/mutual-funds/search?q=HDFC
GET /api/mutual-funds/top-performing

// Protected endpoints (auth required)
GET /api/mutual-funds?page=1&limit=10
GET /api/mutual-funds/100122

// Admin only
POST /api/mutual-funds/sync
```

### **4. Recommendation Tests**
```javascript
// Create recommendation (advisor only)
POST /api/recommendations
{
  "investorId": "{{test_user_id}}",
  "category": "Portfolio Rebalancing",
  "recommendation": "Detailed advice...",
  "priority": "High"
}

// Get recommendations
GET /api/recommendations/advisor     // For advisors
GET /api/recommendations/investor    // For investors

// Update status
PUT /api/recommendations/{{test_recommendation_id}}/status
{
  "status": "Viewed",
  "investorResponse": "Accepted"
}
```

### **5. User Management Tests**
```javascript
// Get profile
GET /api/users/profile

// Update profile
PUT /api/users/profile
{
  "firstName": "Updated Name",
  "riskProfile": "Moderate"
}

// Change password
PUT /api/users/change-password
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

### **6. Error Testing**
```javascript
// Invalid authentication
GET /api/mutual-funds
// Header: Authorization: Bearer invalid_token

// Resource not found
GET /api/mutual-funds/999999

// Rate limit testing (run multiple times quickly)
GET /api/mutual-funds/search?q=test
```

---

## 🔧 **Environment Variables:**

### **Collection Variables:**
| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `base_url` | API base URL | `http://localhost:5000/api` |
| `auth_token` | JWT token | `eyJhbGciOiJIUzI1NiIs...` |
| `test_user_id` | User ID for testing | `507f1f77bcf86cd799439011` |
| `test_recommendation_id` | Rec ID for testing | `507f1f77bcf86cd799439012` |
| `test_scheme_code` | Fund code | `100122` |
| `timestamp` | Unique timestamp | `1703123456789` |

### **Auto-Updated Variables:**
- **auth_token:** Set automatically after login
- **test_user_id:** Set after registration/login
- **test_recommendation_id:** Set after creating recommendation
- **timestamp:** Updated before each request

---

## 📈 **Test Results Interpretation:**

### **✅ Successful Tests:**
```javascript
// Green checkmarks indicate:
✅ Status code is 200/201
✅ Response has expected JSON structure
✅ Authentication tokens are valid
✅ Pagination works correctly
✅ Data validation passes
```

### **❌ Failed Tests:**
```javascript
// Red X marks indicate:
❌ Wrong status code (404, 401, 500)
❌ Missing required fields
❌ Invalid JSON structure
❌ Authentication failures
❌ Rate limiting triggered
```

### **Performance Metrics:**
```javascript
// Automatic checks:
✅ Response time < 5000ms
✅ Content-Type is application/json
✅ Proper headers present
```

---

## 🐛 **Debugging Failed Tests:**

### **Common Issues & Solutions:**

#### **1. Authentication Errors:**
```javascript
// Problem: 401 Unauthorized
// Solution: Run login test first
pm.test("Login first", function () {
    // Check if auth_token is set
    pm.expect(pm.collectionVariables.get("auth_token")).to.not.be.empty;
});
```

#### **2. Environment Variables:**
```javascript
// Problem: Variables not set
// Solution: Check environment configuration
console.log("Auth token:", pm.collectionVariables.get("auth_token"));
console.log("Base URL:", pm.collectionVariables.get("base_url"));
```

#### **3. Backend Not Running:**
```javascript
// Problem: Connection refused
// Solution: Start backend server
// cd mutual-fund-backend && npm run dev
```

#### **4. Database Issues:**
```javascript
// Problem: 500 Internal Server Error
// Solution: Check MongoDB connection
// brew services list | grep mongodb
```

---

## 📊 **Advanced Testing Features:**

### **1. Automated Test Runner:**
```javascript
// Run collection with custom settings
pm.test("Collection runner config", function () {
    // Set iterations, delay, etc.
    pm.collectionVariables.set("iterations", 5);
    pm.collectionVariables.set("delay", 1000);
});
```

### **2. Data-Driven Testing:**
```javascript
// Test multiple scenarios
const testCases = [
    { input: "HDFC", expected: "found" },
    { input: "SBI", expected: "found" },
    { input: "invalid", expected: "not found" }
];

testCases.forEach(testCase => {
    // Run test for each case
});
```

### **3. Performance Testing:**
```javascript
// Measure response times
pm.test("Response time under 2 seconds", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Load testing simulation
pm.test("Handle concurrent requests", function () {
    // Simulate multiple users
    pm.collectionVariables.set("concurrent_users", 10);
});
```

---

## 📋 **Test Checklist:**

### **Pre-Test Setup:**
- [ ] Backend server running on port 5000
- [ ] MongoDB database connected
- [ ] Environment variables configured
- [ ] Postman collection imported
- [ ] Test environment selected

### **Authentication Tests:**
- [ ] Health check passes
- [ ] User registration works
- [ ] Login returns valid JWT token
- [ ] Profile retrieval works
- [ ] Token persists across requests

### **Mutual Fund Tests:**
- [ ] Public search endpoints work
- [ ] Top performing funds load
- [ ] Protected endpoints require auth
- [ ] Fund details retrieval works
- [ ] Admin sync works (if admin user)

### **Recommendation Tests:**
- [ ] Recommendation creation works
- [ ] Advisor can view their recommendations
- [ ] Investor can view received recommendations
- [ ] Status updates work correctly
- [ ] Deletion works (with proper permissions)

### **User Management Tests:**
- [ ] Profile updates work
- [ ] Password changes work
- [ ] Data validation works

### **Error Handling Tests:**
- [ ] Invalid tokens return 401
- [ ] Non-existent resources return 404
- [ ] Rate limiting works
- [ ] Malformed requests handled

---

## 🎯 **Sample Test Run Output:**

```
✅ Health Check - Success (245ms)
✅ Register New User - Success (1234ms)
✅ Login User - Success (567ms)
✅ Get Current User Profile - Success (234ms)
✅ Search Mutual Funds - Success (345ms)
✅ Get Top Performing Funds - Success (456ms)
✅ Get All Mutual Funds - Success (678ms)
✅ Get Mutual Fund by Code - Success (345ms)
✅ Create Recommendation - Success (567ms)
✅ Get Advisor Recommendations - Success (234ms)
✅ Get Investor Recommendations - Success (345ms)
✅ Update Recommendation Status - Success (456ms)
⚠️  Delete Recommendation - Expected 200, got 403 (Admin required)
✅ Update User Profile - Success (345ms)
❌ Invalid Authentication - Expected 401, got 200
✅ Resource Not Found - Success (123ms)

Test Summary: 14 passed, 1 failed, 1 warning
Total Response Time: 8.2 seconds
Average Response Time: 525ms
```

---

## 🚀 **Next Steps:**

1. **Import the collection** into Postman
2. **Configure environment** variables
3. **Start your backend** server
4. **Run the tests** in sequence
5. **Fix any failures** using the debugging guide
6. **Monitor performance** metrics
7. **Add custom tests** for your specific needs

---

## 🆘 **Troubleshooting:**

### **Collection Import Issues:**
- Ensure JSON file is valid
- Check Postman version compatibility
- Try importing individual folders first

### **Environment Setup Issues:**
- Verify variable names match exactly
- Check base URL is correct
- Ensure backend is accessible

### **Authentication Issues:**
- Run login test before authenticated endpoints
- Check token expiration
- Verify user roles and permissions

### **Performance Issues:**
- Check database connection
- Monitor server resources
- Optimize slow queries

---

## 📞 **Support:**

### **For API Issues:**
- Check server logs: `tail -f mutual-fund-backend/logs/app.log`
- Verify database: `mongosh --eval "db.stats()"`
- Test manually: `curl http://localhost:5000/api/health`

### **For Test Issues:**
- Check Postman console for errors
- Verify environment variables
- Run individual requests manually

---

**🎉 Your Mutual Fund Pro API is now fully testable with comprehensive automated testing!**

**Start testing by importing the collection and running the authentication tests first. 🚀📊**
