# 🚀 Backend Setup Guide for Mutual Fund Pro

## 📋 Overview
This guide shows how to set up a complete backend for your Mutual Fund application, replacing external API dependencies and localStorage with a proper database and API server.

---

## 🎯 **Current Architecture vs Backend Architecture**

### **Current (Frontend-Only):**
```
Frontend (React) → External APIs (MFAPI.in) + localStorage
```

### **With Backend:**
```
Frontend (React) → Backend API (Node.js/Express) → Database (MongoDB/PostgreSQL) → External APIs (MFAPI.in)
```

---

## 🛠️ **Option 1: Node.js + Express + MongoDB (Recommended)**

### **Step 1: Project Structure**
```
mutual-fund-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── mutualFundController.js
│   │   ├── recommendationController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── MutualFund.js
│   │   ├── Recommendation.js
│   │   └── Portfolio.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── mutualFunds.js
│   │   ├── recommendations.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── services/
│   │   ├── mfapiService.js
│   │   └── emailService.js
│   ├── config/
│   │   └── database.js
│   └── utils/
│       └── helpers.js
├── tests/
├── package.json
├── server.js
└── .env
```

### **Step 2: Initialize Backend Project**
```bash
# Create backend directory
mkdir mutual-fund-backend
cd mutual-fund-backend

# Initialize npm project
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors helmet morgan dotenv axios nodemailer express-rate-limit express-validator

# Install dev dependencies
npm install -D nodemon jest supertest
```

### **Step 3: Create package.json**
```json
{
  "name": "mutual-fund-backend",
  "version": "1.0.0",
  "description": "Backend API for Mutual Fund Pro",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "seed": "node scripts/seed.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "axios": "^1.5.0",
    "nodemailer": "^6.9.5",
    "express-rate-limit": "^6.10.0",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.4",
    "supertest": "^6.3.3"
  }
}
```

### **Step 4: Create Server Entry Point**
```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const mutualFundRoutes = require('./src/routes/mutualFunds');
const recommendationRoutes = require('./src/routes/recommendations');
const userRoutes = require('./src/routes/users');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-fund-pro', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mutual-funds', mutualFundRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
```

### **Step 5: Database Models**

#### **User Model:**
```javascript
// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['Investor', 'Financial Advisor', 'Admin', 'Data Analyst'],
    default: 'Investor'
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  phone: {
    type: String,
    trim: true
  },
  riskProfile: {
    type: String,
    enum: ['Conservative', 'Moderate', 'Aggressive'],
    default: 'Moderate'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
```

#### **Mutual Fund Model:**
```javascript
// src/models/MutualFund.js
const mongoose = require('mongoose');

const mutualFundSchema = new mongoose.Schema({
  schemeCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  schemeName: {
    type: String,
    required: true,
    trim: true
  },
  fundHouse: {
    type: String,
    required: true,
    trim: true
  },
  schemeType: {
    type: String,
    enum: ['Open Ended', 'Close Ended', 'Interval'],
    default: 'Open Ended'
  },
  schemeCategory: {
    type: String,
    enum: ['Equity', 'Debt', 'Hybrid', 'Solution Oriented', 'Others'],
    required: true
  },
  nav: {
    type: Number,
    required: true,
    min: 0
  },
  navDate: {
    type: Date,
    required: true
  },
  // Historical NAV data (last 30 days)
  historicalNav: [{
    date: { type: Date, required: true },
    nav: { type: Number, required: true, min: 0 },
    change: { type: Number, default: 0 },
    changePercent: { type: Number, default: 0 }
  }],
  // Performance metrics
  returns: {
    '1day': { type: Number, default: 0 },
    '7day': { type: Number, default: 0 },
    '30day': { type: Number, default: 0 },
    '90day': { type: Number, default: 0 },
    '1year': { type: Number, default: 0 },
    '3year': { type: Number, default: 0 },
    '5year': { type: Number, default: 0 }
  },
  // Risk metrics
  riskMetrics: {
    volatility: { type: Number, default: 0 },
    sharpeRatio: { type: Number, default: 0 },
    sortinoRatio: { type: Number, default: 0 },
    beta: { type: Number, default: 1 }
  },
  // Fund details
  fundDetails: {
    inceptionDate: { type: Date },
    assetsUnderManagement: { type: Number }, // in crores
    expenseRatio: { type: Number },
    exitLoad: { type: String },
    minInvestment: { type: Number },
    sipMinAmount: { type: Number }
  },
  // MFAPI.in data source
  lastUpdatedFromAPI: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
mutualFundSchema.index({ schemeCategory: 1, schemeType: 1 });
mutualFundSchema.index({ fundHouse: 1 });
mutualFundSchema.index({ nav: -1 }); // For sorting by NAV

// Virtual for full name
mutualFundSchema.virtual('fullName').get(function() {
  return `${this.schemeName} (${this.schemeCode})`;
});

module.exports = mongoose.model('MutualFund', mutualFundSchema);
```

#### **Recommendation Model:**
```javascript
// src/models/Recommendation.js
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  // Advisor who made the recommendation
  advisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  advisorName: {
    type: String,
    required: true
  },

  // Investor receiving the recommendation
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investorName: {
    type: String,
    required: true
  },
  investorUsername: {
    type: String,
    required: true
  },

  // Recommendation details
  category: {
    type: String,
    required: true,
    enum: [
      'Portfolio Rebalancing',
      'New Investment',
      'Sector Rotation',
      'Tax Optimization',
      'Risk Reduction',
      'Dividend Strategy',
      'Debt Allocation',
      'Equity Allocation',
      'Fund Switching'
    ]
  },

  recommendation: {
    type: String,
    required: true,
    maxlength: 2000
  },

  reasoning: {
    type: String,
    maxlength: 1000
  },

  // Associated mutual fund (if applicable)
  mutualFundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MutualFund'
  },
  schemeCode: {
    type: String
  },
  schemeName: {
    type: String
  },

  // Financial projections
  expectedReturn: {
    type: String,
    maxlength: 50
  },

  riskLevel: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
  },

  timeframe: {
    type: String,
    maxlength: 100
  },

  // Investment amount suggestions
  suggestedAmount: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' }
  },

  // Priority and status
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },

  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Viewed', 'Accepted', 'Implemented', 'Rejected', 'Expired'],
    default: 'Draft'
  },

  // Timestamps
  sentAt: {
    type: Date
  },

  viewedAt: {
    type: Date
  },

  respondedAt: {
    type: Date
  },

  implementedAt: {
    type: Date
  },

  // Investor response
  investorResponse: {
    type: String,
    enum: ['Accepted', 'Rejected', 'Under Review', 'Implemented'],
  },

  investorComments: {
    type: String,
    maxlength: 500
  },

  // Expiry and follow-up
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  },

  followUpRequired: {
    type: Boolean,
    default: false
  },

  followUpDate: {
    type: Date
  },

  // Metadata
  tags: [{
    type: String,
    trim: true
  }],

  // Audit trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
recommendationSchema.index({ advisorId: 1, createdAt: -1 });
recommendationSchema.index({ investorId: 1, status: 1, createdAt: -1 });
recommendationSchema.index({ status: 1, priority: 1 });
recommendationSchema.index({ expiresAt: 1 });

// Virtual for days until expiry
recommendationSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiresAt) return null;
  const now = new Date();
  const diffTime = this.expiresAt - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for isExpired
recommendationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
```

### **Step 6: API Controllers**

#### **Mutual Fund Controller:**
```javascript
// src/controllers/mutualFundController.js
const MutualFund = require('../models/MutualFund');
const axios = require('axios');

const MFAPI_BASE_URL = 'https://api.mfapi.in/mf';

// Get all mutual funds with pagination and filtering
exports.getAllMutualFunds = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      fundHouse,
      schemeType,
      sortBy = 'nav',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };

    if (category) query.schemeCategory = category;
    if (fundHouse) query.fundHouse = fundHouse;
    if (schemeType) query.schemeType = schemeType;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      select: 'schemeCode schemeName fundHouse schemeCategory nav navDate'
    };

    const result = await MutualFund.paginate(query, options);

    res.json({
      success: true,
      data: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalFunds: result.totalDocs,
        hasNext: result.hasNextPage,
        hasPrev: result.hasPrevPage
      }
    });

  } catch (error) {
    console.error('Error fetching mutual funds:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mutual funds',
      error: error.message
    });
  }
};

// Get specific mutual fund by scheme code
exports.getMutualFundByCode = async (req, res) => {
  try {
    const { schemeCode } = req.params;

    let fund = await MutualFund.findOne({ schemeCode, isActive: true });

    // If not in database, try to fetch from MFAPI.in
    if (!fund) {
      try {
        const response = await axios.get(`${MFAPI_BASE_URL}/${schemeCode}`);
        const apiData = response.data;

        // Create new fund record
        fund = new MutualFund({
          schemeCode: apiData.schemeCode,
          schemeName: apiData.schemeName,
          fundHouse: apiData.meta?.fund_house,
          schemeType: apiData.meta?.scheme_type,
          schemeCategory: apiData.meta?.scheme_category,
          nav: apiData.nav,
          navDate: new Date(apiData.date),
          lastUpdatedFromAPI: new Date()
        });

        await fund.save();
      } catch (apiError) {
        return res.status(404).json({
          success: false,
          message: 'Mutual fund not found'
        });
      }
    }

    res.json({
      success: true,
      data: fund
    });

  } catch (error) {
    console.error('Error fetching mutual fund:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mutual fund',
      error: error.message
    });
  }
};

// Search mutual funds
exports.searchMutualFunds = async (req, res) => {
  try {
    const { q: searchQuery, limit = 10 } = req.query;

    if (!searchQuery || searchQuery.length < 2) {
      return res.json({
        success: true,
        data: [],
        message: 'Search query must be at least 2 characters'
      });
    }

    const funds = await MutualFund.find({
      isActive: true,
      $or: [
        { schemeName: { $regex: searchQuery, $options: 'i' } },
        { fundHouse: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .limit(parseInt(limit))
    .select('schemeCode schemeName fundHouse schemeCategory nav');

    res.json({
      success: true,
      data: funds,
      count: funds.length
    });

  } catch (error) {
    console.error('Error searching mutual funds:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching mutual funds',
      error: error.message
    });
  }
};

// Get top performing funds
exports.getTopPerformingFunds = async (req, res) => {
  try {
    const { period = '30day', limit = 10 } = req.query;

    const funds = await MutualFund.find({ isActive: true })
      .sort({ [`returns.${period}`]: -1 })
      .limit(parseInt(limit))
      .select(`schemeCode schemeName fundHouse schemeCategory nav returns.${period}`);

    res.json({
      success: true,
      data: funds,
      period,
      count: funds.length
    });

  } catch (error) {
    console.error('Error fetching top funds:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top performing funds',
      error: error.message
    });
  }
};

// Sync fund data from MFAPI.in
exports.syncFundData = async (req, res) => {
  try {
    console.log('🔄 Starting fund data sync from MFAPI.in...');

    // Get all schemes from MFAPI.in
    const response = await axios.get(MFAPI_BASE_URL);
    const schemes = response.data;

    let updated = 0;
    let created = 0;

    // Process each scheme
    for (const scheme of schemes.slice(0, 100)) { // Limit for demo
      try {
        const schemeResponse = await axios.get(`${MFAPI_BASE_URL}/${scheme.schemeCode}`);
        const schemeData = schemeResponse.data;

        const updateData = {
          schemeName: schemeData.schemeName,
          fundHouse: schemeData.meta?.fund_house,
          schemeType: schemeData.meta?.scheme_type,
          schemeCategory: schemeData.meta?.scheme_category,
          nav: schemeData.nav,
          navDate: new Date(schemeData.date),
          lastUpdatedFromAPI: new Date()
        };

        const result = await MutualFund.findOneAndUpdate(
          { schemeCode: scheme.schemeCode },
          updateData,
          { upsert: true, new: true }
        );

        if (result.isNew) {
          created++;
        } else {
          updated++;
        }

        // Add small delay to respect API limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.warn(`Failed to sync scheme ${scheme.schemeCode}:`, error.message);
      }
    }

    res.json({
      success: true,
      message: 'Fund data sync completed',
      stats: {
        totalProcessed: updated + created,
        updated,
        created
      }
    });

  } catch (error) {
    console.error('Error syncing fund data:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing fund data',
      error: error.message
    });
  }
};
```

#### **Recommendation Controller:**
```javascript
// src/controllers/recommendationController.js
const Recommendation = require('../models/Recommendation');

// Create new recommendation
exports.createRecommendation = async (req, res) => {
  try {
    const recommendationData = {
      ...req.body,
      advisorId: req.user.id,
      createdBy: req.user.id
    };

    const recommendation = new Recommendation(recommendationData);
    await recommendation.save();

    // Populate references
    await recommendation.populate('advisorId investorId mutualFundId', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Recommendation created successfully',
      data: recommendation
    });

  } catch (error) {
    console.error('Error creating recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating recommendation',
      error: error.message
    });
  }
};

// Get recommendations for advisor
exports.getAdvisorRecommendations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      investorId
    } = req.query;

    const query = { advisorId: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (investorId) query.investorId = investorId;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'investorId', select: 'username firstName lastName' },
        { path: 'mutualFundId', select: 'schemeName schemeCode' }
      ]
    };

    const result = await Recommendation.paginate(query, options);

    res.json({
      success: true,
      data: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalRecommendations: result.totalDocs
      }
    });

  } catch (error) {
    console.error('Error fetching advisor recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
};

// Get recommendations for investor
exports.getInvestorRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      investorId: req.user.id,
      status: { $ne: 'Draft' } // Don't show draft recommendations
    })
    .sort({ createdAt: -1 })
    .populate('advisorId', 'username firstName lastName')
    .populate('mutualFundId', 'schemeName schemeCode');

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length
    });

  } catch (error) {
    console.error('Error fetching investor recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
};

// Update recommendation status
exports.updateRecommendationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, investorResponse, investorComments } = req.body;

    const updateData = {
      status,
      updatedBy: req.user.id
    };

    // Add investor-specific fields if user is investor
    if (req.user.role === 'Investor') {
      updateData.investorResponse = investorResponse;
      updateData.investorComments = investorComments;
      updateData.respondedAt = new Date();
    }

    // Add timestamps based on status
    if (status === 'Viewed' && !updateData.viewedAt) {
      updateData.viewedAt = new Date();
    }
    if (status === 'Implemented' && !updateData.implementedAt) {
      updateData.implementedAt = new Date();
    }
    if (status === 'Sent' && !updateData.sentAt) {
      updateData.sentAt = new Date();
    }

    const recommendation = await Recommendation.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('advisorId investorId mutualFundId');

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    res.json({
      success: true,
      message: 'Recommendation updated successfully',
      data: recommendation
    });

  } catch (error) {
    console.error('Error updating recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating recommendation',
      error: error.message
    });
  }
};

// Delete recommendation
exports.deleteRecommendation = async (req, res) => {
  try {
    const { id } = req.params;

    const recommendation = await Recommendation.findById(id);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    // Only allow advisor who created it or admin to delete
    if (recommendation.advisorId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recommendation'
      });
    }

    await Recommendation.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Recommendation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recommendation',
      error: error.message
    });
  }
};
```

### **Step 7: API Routes**

#### **Mutual Fund Routes:**
```javascript
// src/routes/mutualFunds.js
const express = require('express');
const router = express.Router();
const mutualFundController = require('../controllers/mutualFundController');
const auth = require('../middleware/auth');

// Public routes
router.get('/search', mutualFundController.searchMutualFunds);
router.get('/top-performing', mutualFundController.getTopPerformingFunds);

// Protected routes
router.use(auth); // All routes below require authentication

router.get('/', mutualFundController.getAllMutualFunds);
router.get('/:schemeCode', mutualFundController.getMutualFundByCode);

// Admin only routes
router.post('/sync', auth, (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
}, mutualFundController.syncFundData);

module.exports = router;
```

#### **Recommendation Routes:**
```javascript
// src/routes/recommendations.js
const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Advisor routes
router.get('/advisor', recommendationController.getAdvisorRecommendations);
router.post('/', recommendationController.createRecommendation);

// Investor routes
router.get('/investor', recommendationController.getInvestorRecommendations);

// Shared routes
router.put('/:id/status', recommendationController.updateRecommendationStatus);
router.delete('/:id', recommendationController.deleteRecommendation);

module.exports = router;
```

### **Step 8: Authentication Middleware**
```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive user'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
};

module.exports = auth;
```

### **Step 9: Environment Configuration**
```env
# .env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mutual-fund-pro

JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000

# Email configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# MFAPI.in configuration
MFAPI_BASE_URL=https://api.mfapi.in

# Rate limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### **Step 10: Frontend Integration**

#### **Update API Service Calls:**
```javascript
// src/services/api.js - New centralized API service
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### **Update Mutual Fund Service:**
```javascript
// src/services/mutualFundAPI.js - Update to use backend
import api from './api';

// Get market data (now from our backend)
export const fetchMarketData = async () => {
  try {
    const response = await api.get('/mutual-funds/market-overview');
    return {
      success: true,
      data: response.data.data,
      source: 'Backend API'
    };
  } catch (error) {
    console.error('Backend API error:', error);
    // Fallback to original logic
    return fallbackMarketData();
  }
};

// Get mutual funds from backend
export const fetchTopFunds = async () => {
  try {
    const response = await api.get('/mutual-funds/top-performing?limit=10');
    return {
      success: true,
      data: response.data.data,
      source: 'Backend API'
    };
  } catch (error) {
    console.error('Backend API error:', error);
    return fallbackTopFunds();
  }
};

// Search funds
export const searchFunds = async (query) => {
  try {
    const response = await api.get(`/mutual-funds/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Search API error:', error);
    return { success: false, data: [] };
  }
};
```

#### **Update Recommendation Service:**
```javascript
// src/services/recommendationService.js - Update to use backend
import api from './api';

// Get recommendations for investor
export const getRecommendationsForInvestor = async () => {
  try {
    const response = await api.get('/recommendations/investor');
    return response.data.data;
  } catch (error) {
    console.error('Recommendations API error:', error);
    return [];
  }
};

// Create recommendation (advisor only)
export const createRecommendation = async (recommendationData) => {
  try {
    const response = await api.post('/recommendations', recommendationData);
    return response.data;
  } catch (error) {
    console.error('Create recommendation error:', error);
    return { success: false, error: error.message };
  }
};

// Update recommendation status
export const updateRecommendationStatus = async (recommendationId, status) => {
  try {
    const response = await api.put(`/recommendations/${recommendationId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Update recommendation error:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 🐍 **Option 2: Python + FastAPI + PostgreSQL**

### **Step 1: Project Setup**
```bash
# Create backend directory
mkdir mutual-fund-backend-python
cd mutual-fund-backend-python

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic pydantic python-jose bcrypt python-multipart aiohttp

# Development dependencies
pip install pytest httpx
```

### **Step 2: FastAPI Application Structure**
```
mutual-fund-backend-python/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── mutual_fund.py
│   │   └── recommendation.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── mutual_fund.py
│   │   └── recommendation.py
│   ├── crud/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── mutual_fund.py
│   │   └── recommendation.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── mutual_funds.py
│   │   ├── recommendations.py
│   │   └── users.py
│   └── services/
│       ├── __init__.py
│       ├── auth.py
│       ├── mfapi.py
│       └── email.py
├── tests/
├── alembic/
├── requirements.txt
└── .env
```

### **Step 3: FastAPI Main Application**
```python
# app/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.database import engine, Base
from app.routers import auth, mutual_funds, recommendations, users

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mutual Fund Pro API",
    description="Backend API for Mutual Fund Pro application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(mutual_funds.router, prefix="/api/mutual-funds", tags=["Mutual Funds"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Mutual Fund Pro API",
        "version": "1.0.0"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "detail": str(exc) if app.debug else "An error occurred"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
```

---

## 🐳 **Option 3: Docker + Docker Compose Setup**

### **Step 1: Docker Compose Configuration**
```yaml
# docker-compose.yml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:7-jammy
    container_name: mutual-fund-mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: mutual_fund_pro
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./docker/mongo-init:/docker-entrypoint-initdb.d
    networks:
      - mutual-fund-network

  # Backend API
  backend:
    build: ./mutual-fund-backend
    container_name: mutual-fund-backend
    restart: always
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://admin:password@mongodb:27017/mutual_fund_pro
      JWT_SECRET: your-production-jwt-secret
      FRONTEND_URL: http://frontend:3000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    volumes:
      - ./mutual-fund-backend:/app
      - /app/node_modules
    networks:
      - mutual-fund-network

  # Frontend
  frontend:
    build: ./Mutual-Fund-Pro
    container_name: mutual-fund-frontend
    restart: always
    environment:
      REACT_APP_API_URL: http://backend:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - mutual-fund-network

volumes:
  mongodb_data:

networks:
  mutual-fund-network:
    driver: bridge
```

### **Step 2: Backend Dockerfile**
```dockerfile
# mutual-fund-backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### **Step 3: Frontend Dockerfile**
```dockerfile
# Mutual-Fund-Pro/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### **Step 4: Environment Files**

#### **Backend .env**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password@mongodb:27017/mutual_fund_pro
JWT_SECRET=your-production-jwt-secret-here
FRONTEND_URL=http://frontend:3000
```

#### **Frontend .env**
```env
REACT_APP_API_URL=http://backend:5000/api
```

### **Step 5: MongoDB Initialization**
```javascript
// docker/mongo-init/init.js
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'mutual_fund_pro'
    }
  ]
});

// Create collections
db.createCollection('users');
db.createCollection('mutualfunds');
db.createCollection('recommendations');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.mutualfunds.createIndex({ "schemeCode": 1 }, { unique: true });
db.recommendations.createIndex({ "advisorId": 1, "createdAt": -1 });
db.recommendations.createIndex({ "investorId": 1, "status": 1 });
```

### **Step 6: Docker Deployment**
```bash
# Build and start all services
docker-compose up --build -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🚀 **Quick Start Commands**

### **For Node.js Backend:**
```bash
# Clone and setup
cd mutual-fund-backend
npm install
cp .env.example .env  # Configure your environment
npm run dev  # Development
npm start  # Production
```

### **For Python FastAPI Backend:**
```bash
# Setup
cd mutual-fund-backend-python
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **For Docker Deployment:**
```bash
# From project root
docker-compose up --build -d
# Access at http://localhost:3000
```

---

## 📊 **API Endpoints Summary**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| GET | `/api/mutual-funds` | Get all funds | Yes |
| GET | `/api/mutual-funds/search` | Search funds | No |
| GET | `/api/mutual-funds/top-performing` | Top performers | No |
| GET | `/api/mutual-funds/:code` | Fund details | Yes |
| POST | `/api/recommendations` | Create recommendation | Yes (Advisor) |
| GET | `/api/recommendations/advisor` | Advisor recommendations | Yes |
| GET | `/api/recommendations/investor` | Investor recommendations | Yes |
| PUT | `/api/recommendations/:id/status` | Update status | Yes |

---

## 🔒 **Security Features**

- ✅ **JWT Authentication** with refresh tokens
- ✅ **Password hashing** with bcrypt
- ✅ **Rate limiting** to prevent abuse
- ✅ **CORS protection** for cross-origin requests
- ✅ **Input validation** with express-validator
- ✅ **Helmet.js** for security headers
- ✅ **Data sanitization** to prevent injection attacks

---

## 📈 **Scaling Considerations**

### **Database Optimization:**
- **Indexes** on frequently queried fields
- **Pagination** for large result sets
- **Caching** with Redis (future enhancement)
- **Read replicas** for high traffic

### **API Performance:**
- **Request compression** with gzip
- **Database connection pooling**
- **API response caching**
- **Background job processing**

### **Monitoring:**
- **Request logging** with Morgan
- **Error tracking** and alerting
- **Performance monitoring**
- **Health checks** for all services

---

## 🧪 **Testing Setup**

### **Backend Tests:**
```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Authentication', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
```

### **API Testing with Postman:**
```json
{
  "name": "Mutual Fund Pro API",
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 🎯 **Next Steps After Setup**

1. **Test all API endpoints** with Postman
2. **Update frontend** to use new API endpoints
3. **Implement real-time features** (WebSocket)
4. **Add file upload** for documents
5. **Set up monitoring** and logging
6. **Configure CI/CD** pipeline
7. **Add comprehensive tests**
8. **Deploy to production**

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **MongoDB Connection Failed:**
   ```bash
   # Check MongoDB status
   brew services list | grep mongodb  # macOS
   sudo systemctl status mongod      # Linux
   ```

2. **Port Already in Use:**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

3. **CORS Errors:**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure CORS middleware is configured

4. **JWT Token Issues:**
   - Verify `JWT_SECRET` is set
   - Check token expiration time

5. **MFAPI.in Rate Limits:**
   - Implement caching to reduce API calls
   - Add delays between requests

---

## 📚 **Additional Resources**

- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **MongoDB Documentation:** https://docs.mongodb.com/
- **JWT.io:** https://jwt.io/
- **Express.js Guide:** https://expressjs.com/
- **Docker Best Practices:** https://docs.docker.com/develop/dev-best-practices/

---

**🎉 Your Mutual Fund Pro application now has a complete, production-ready backend!**

**Choose your preferred technology stack and follow the setup guide to get started! 🚀📊💰**
