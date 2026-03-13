import YahooFinance from 'yahoo-finance2';

// Shared instance with default configuration
export const yahooFinance = new YahooFinance({ 
  suppressNotices: ['yahooSurvey', 'ripHistorical'] 
});

export default yahooFinance;
