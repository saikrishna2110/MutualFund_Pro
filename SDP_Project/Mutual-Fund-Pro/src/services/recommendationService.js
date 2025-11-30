// Recommendation Service - Manages advisor recommendations for investors
// In production, this would connect to a backend API

const STORAGE_KEY = 'advisor_recommendations';

// Mock investors data - in real app, this would come from API
const mockInvestors = [
  { id: 1, name: "Sai", username: "sai", email: "sai@example.com", riskProfile: "Moderate" },
  { id: 2, name: "Sai Krishna", username: "saikrishna", email: "sai.krishna@example.com", riskProfile: "Conservative" },
  { id: 3, name: "Vijay Veekas", username: "vijay", email: "vijay@example.com", riskProfile: "Aggressive" },
  { id: 4, name: "Teja Thrishank", username: "teja", email: "teja@example.com", riskProfile: "Moderate" },
  { id: 5, name: "Dilip", username: "dilip", email: "dilip@example.com", riskProfile: "Conservative" }
];

// Get all investors
export const getInvestors = () => {
  return mockInvestors;
};

// Get investor by username
export const getInvestorByUsername = (username) => {
  return mockInvestors.find(investor => investor.username === username);
};

// Get all recommendations
export const getAllRecommendations = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading recommendations:', error);
    return [];
  }
};

// Get recommendations for a specific investor
export const getRecommendationsForInvestor = (investorUsername) => {
  const allRecommendations = getAllRecommendations();
  return allRecommendations.filter(rec => rec.investorUsername === investorUsername);
};

// Get recommendations by advisor
export const getRecommendationsByAdvisor = (advisorUsername) => {
  const allRecommendations = getAllRecommendations();
  return allRecommendations.filter(rec => rec.advisorUsername === advisorUsername);
};

// Create a new recommendation
export const createRecommendation = (recommendationData) => {
  try {
    const recommendations = getAllRecommendations();

    const newRecommendation = {
      id: Date.now(), // Simple ID generation
      ...recommendationData,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    recommendations.push(newRecommendation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recommendations));

    return { success: true, data: newRecommendation };
  } catch (error) {
    console.error('Error creating recommendation:', error);
    return { success: false, error: error.message };
  }
};

// Update recommendation status
export const updateRecommendationStatus = (recommendationId, newStatus) => {
  try {
    const recommendations = getAllRecommendations();
    const index = recommendations.findIndex(rec => rec.id === recommendationId);

    if (index !== -1) {
      recommendations[index].status = newStatus;
      recommendations[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recommendations));
      return { success: true, data: recommendations[index] };
    }

    return { success: false, error: 'Recommendation not found' };
  } catch (error) {
    console.error('Error updating recommendation:', error);
    return { success: false, error: error.message };
  }
};

// Delete recommendation
export const deleteRecommendation = (recommendationId) => {
  try {
    const recommendations = getAllRecommendations();
    const filtered = recommendations.filter(rec => rec.id !== recommendationId);

    if (filtered.length !== recommendations.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return { success: true };
    }

    return { success: false, error: 'Recommendation not found' };
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    return { success: false, error: error.message };
  }
};

// Get recommendation statistics
export const getRecommendationStats = (advisorUsername) => {
  const recommendations = getRecommendationsByAdvisor(advisorUsername);

  return {
    total: recommendations.length,
    pending: recommendations.filter(r => r.status === "Pending").length,
    implemented: recommendations.filter(r => r.status === "Implemented").length,
    inProgress: recommendations.filter(r => r.status === "In Progress").length,
    highPriority: recommendations.filter(r => r.priority === "High").length
  };
};

// Initialize with some sample data if empty
export const initializeSampleData = () => {
  const existing = getAllRecommendations();
  if (existing.length === 0) {
    const sampleRecommendations = [
      {
        id: 1,
        investorId: 1,
        investorUsername: "sai",
        investorName: "Sai",
        advisorUsername: "advisor1",
        advisorName: "Rajesh Kumar",
        riskProfile: "Moderate",
        category: "Portfolio Rebalancing",
        recommendation: "Rebalance portfolio by reducing technology exposure from 40% to 25% and increasing healthcare allocation to 20%. This will help diversify your investments and reduce sector-specific risks.",
        expectedReturn: "8.5-9.5%",
        riskLevel: "Medium",
        timeframe: "3-6 months",
        status: "Pending",
        priority: "High",
        date: "2024-10-25",
        reasoning: "Technology sector has shown overvaluation signs, while healthcare offers better long-term growth potential."
      },
      {
        id: 2,
        investorId: 2,
        investorUsername: "saikrishna",
        investorName: "Sai Krishna",
        advisorUsername: "advisor1",
        advisorName: "Rajesh Kumar",
        riskProfile: "Conservative",
        category: "New Investment",
        recommendation: "Consider adding HDFC Corporate Bond Fund for stable income generation. Allocate 15% of your portfolio to this fund for better yield and diversification.",
        expectedReturn: "6.0-7.0%",
        riskLevel: "Low",
        timeframe: "1-3 months",
        status: "Implemented",
        priority: "Medium",
        date: "2024-10-20",
        reasoning: "Your current portfolio lacks fixed income exposure. This will provide stability and regular income."
      },
      {
        id: 3,
        investorId: 3,
        investorUsername: "vijay",
        investorName: "Vijay Veekas",
        advisorUsername: "advisor1",
        advisorName: "Rajesh Kumar",
        riskProfile: "Aggressive",
        category: "Sector Rotation",
        recommendation: "Rotate from banking sector to technology and renewable energy funds. Consider switching 20% of banking allocation to green energy ETFs.",
        expectedReturn: "12.0-15.0%",
        riskLevel: "High",
        timeframe: "1-2 months",
        status: "Pending",
        priority: "High",
        date: "2024-10-15",
        reasoning: "Banking sector is currently overvalued. Technology and renewable energy sectors show stronger growth potential."
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleRecommendations));
  }
};
